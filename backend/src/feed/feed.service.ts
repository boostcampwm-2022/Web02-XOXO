/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Feed } from '@root/entities/Feed.entity';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';
import {
  GroupFeedMembersCountError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
import User from '@root/entities/User.entity';
import { UserReq } from '@root/users/decorators/users.decorators';
import CreateFeedDto from '@feed/dto/create.feed.dto';
import { decrypt } from '@feed/feed.utils';
import FindFeedDto from '@feed/dto/find.feed.dto';
import UserRepository from '@root/users/users.repository';
import { FeedRepository } from '@feed/feed.repository';
import FeedResponseDto from './dto/response/feed.response.dto';
import { UserFeedMappingRepository } from './user.feed.mapping.repository';
import FeedInfoDto from './dto/info.feed.dto';

@Injectable()
export class FeedService {
  constructor(
    private feedRepository: FeedRepository,
    private userFeedMappingRepository: UserFeedMappingRepository,
    private userRepository: UserRepository,
    private dataSource: DataSource,
  ) {}

  async getFeedInfo(encryptedFeedID: string, userId: number) {
    const id = Number(decrypt(encryptedFeedID));
    let feedInfoDto: FeedInfoDto;
    await this.dataSource.transaction(async (manager) => {
      const feed = await manager.find(Feed, {
        where: { id },
        relations: ['postings', 'users'],
        select: {
          postings: { id: true },
          users: { userId: true },
          name: true,
          description: true,
          thumbnail: true,
          dueDate: true,
        },
      });
      feedInfoDto = FeedInfoDto.createFeedInfoDto(feed[0], userId);
      if (feedInfoDto.isOwner) {
        await manager.update(User, userId, { lastVistedFeed: id });
      }
    });
    return feedInfoDto;
  }

  async getFeedMemberList(encryptedFeedID: string, userId: number) {
    const feedId = Number(decrypt(encryptedFeedID));
    const memberList = await this.userFeedMappingRepository.getFeedMemberList(
      userId,
      feedId,
    );
    if (!memberList) throw new NonExistFeedError();
    return memberList;
  }

  async getFeedById(encryptedFeedID: string) {
    const id = Number(decrypt(encryptedFeedID));
    const findFeedDto: FindFeedDto = { id };
    const feed = await this.feedRepository.getFeedByFindFeedDto(findFeedDto);
    return feed[0];
  }

  async createFeed(createFeedDto: CreateFeedDto, userId: number) {
    let feed: Feed;
    await this.dataSource.transaction(async (manager) => {
      feed = await manager
        .withRepository(this.feedRepository)
        .saveFeed(createFeedDto, false);
      await manager
        .withRepository(this.userFeedMappingRepository)
        .saveUserFeedMapping(feed.id, userId);
      await manager
        .withRepository(this.userRepository)
        .updateLastVisitedFeed(userId, feed.id);
    });
    return FeedResponseDto.makeFeedResponseDto(feed).encryptedId;
  }

  async createGroupFeed(
    createFeedDto: CreateFeedDto,
    memberIdList: number[],
    userId: number,
  ) {
    // 그룹 피드 멤버 2명 이상 100명 미만인지 체크
    if (!memberIdList || memberIdList.length < 2 || memberIdList.length > 100)
      throw new GroupFeedMembersCountError();

    let feed: Feed;
    await this.dataSource.transaction(async (manager) => {
      const feedRepository = manager.withRepository(this.feedRepository);
      feed = await feedRepository.saveFeed(createFeedDto, true);
      const userFeedMappingRepository = manager.withRepository(
        this.userFeedMappingRepository,
      );
      await userFeedMappingRepository.saveUserFeedMappingBulk(
        memberIdList,
        feed.id,
      );
      const userRepository = manager.withRepository(this.userRepository);
      await userRepository.updateLastVisitedFeed(userId, feed.id);
    });
    return FeedResponseDto.makeFeedResponseDto(feed).encryptedId;
  }

  async editFeed(createFeedDto: CreateFeedDto, feedId: number) {
    await this.feedRepository.updateFeed(feedId, createFeedDto);
  }

  async editGroupFeed(
    createFeedDto: CreateFeedDto,
    feedId: number,
    memberIdList: number[],
    userId: number,
  ) {
    // 그룹 피드 멤버 2명 이상 100명 미만인지 체크
    if (!memberIdList || memberIdList.length < 1 || memberIdList.length > 99)
      throw new GroupFeedMembersCountError();

    await this.dataSource.transaction(async (manager) => {
      await manager
        .withRepository(this.feedRepository)
        .updateFeed(feedId, createFeedDto);
      const prevMemberList = await manager
        .withRepository(this.userFeedMappingRepository)
        .getFeedMemberList(userId, feedId);
      const deleteList = prevMemberList.filter(
        (member) => !memberIdList.includes(member),
      );
      await manager
        .withRepository(this.userFeedMappingRepository)
        .deleteUserFeedMapping(deleteList);
      const insertList = memberIdList.filter(
        (member) => !prevMemberList.includes(member),
      );
      await manager
        .withRepository(this.userFeedMappingRepository)
        .saveUserFeedMappingBulk(insertList, feedId);
    });
  }

  async getGroupFeedList(userId: number) {
    const feedList = await this.userFeedMappingRepository.getFeedList(
      userId,
      true,
    );
    if (!feedList) throw new NonExistFeedError();
    return FeedResponseDto.makeFeedResponseArray(feedList);
  }

  async getPersonalFeedList(userId: number) {
    const feedList = await this.userFeedMappingRepository.getFeedList(
      userId,
      false,
    );
    if (!feedList) throw new NonExistFeedError();
    return FeedResponseDto.makeFeedResponseArray(feedList);
  }

  async checkFeedOwner(id: number, feedid: string) {
    const feedId = Number(feedid);
    const owner = await this.userFeedMappingRepository.checkFeedOwner(
      id,
      feedId,
    );
    return owner;
  }
}
