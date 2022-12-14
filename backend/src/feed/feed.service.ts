/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  CustomRepositoryCannotInheritRepositoryError,
  DataSource,
} from 'typeorm';
import { Feed } from '@root/entities/Feed.entity';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';
import {
  GroupFeedMembersCountError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
import { UserRepository } from '@root/users/users.repository';
import User from '@root/entities/User.entity';
import CreateFeedDto from '@feed/dto/create.feed.dto';
import { decrypt } from '@feed/feed.utils';
import Posting from '@root/entities/Posting.entity';
import FindFeedDto from '@feed/dto/find.feed.dto';
import FeedInfoDto from '@feed/dto/info.feed.dto';
import { FeedRepository } from '@feed/feed.repository';
import FeedResponseDto from './dto/response/feed.response.dto';
import { UserFeedMappingRepository } from './user.feed.mapping.repository';

@Injectable()
export class FeedService {
  constructor(
    private feedRepository: FeedRepository,
    private userRepository: UserRepository,
    private userFeedMappingRepository: UserFeedMappingRepository,
    private dataSource: DataSource,
  ) {}

  async getFeedInfo(encryptedFeedID: string, userId: number) {
    const id = Number(decrypt(encryptedFeedID));
    await this.dataSource.transaction(async (manager) => {
      const feed = await manager.find(Feed, {
        where: { id },
        relations: ['postings'],
        select: {
          postings: { id: true },
          name: true,
          description: true,
          thumbnail: true,
          dueDate: true,
          isGroupFeed: true,
        },
      });
      const user = await manager.find(UserFeedMapping, {
        where: { feedId: id, userId },
      });

      const feedInfoDto = FeedInfoDto.createFeedInfoDto(feed[0], user[0]);
      if (feedInfoDto.isOwner) {
        await manager.update(User, userId, { lastVistedFeed: id });
      }
      return feedInfoDto;
    });
  }

  async getFeedById(encryptedFeedID: string) {
    const id = Number(decrypt(encryptedFeedID));
    const findFeedDto: FindFeedDto = { id };
    const feed = await this.feedRepository.getFeedByFindFeedDto(findFeedDto);
    return feed[0];
  }

  async getPostingThumbnails(
    encryptedFeedID: string,
    startPostingId: number,
    scrollSize: number,
  ) {
    const id = Number(decrypt(encryptedFeedID));
    const postingThumbnailList = await this.feedRepository.getThumbnailList(
      startPostingId,
      scrollSize,
      id,
    );

    // 쿼리 2번 - 추후쿼리 최적화 때 속도 비교
    // const postingThumbnailList2 = await this.dataSource
    //   .getRepository(Feed)
    //   .find({
    //     select: { postings: { id: true, thumbnail: true } },
    //     relations: ['postings'],
    //     where: { id, postings: { id: MoreThan(startPostingId) } },
    //     take: postingCount,
    //   });

    return postingThumbnailList;
  }

  async createFeed(createFeedDto: CreateFeedDto, userId: number) {
    let feed: Feed;
    await this.dataSource.transaction(async (manager) => {
      feed = await manager.save(Feed, {
        ...createFeedDto,
        isGroupFeed: false,
      });
      await manager.insert(UserFeedMapping, { feedId: feed.id, userId });
      await manager.update(User, userId, { lastVistedFeed: feed.id });
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
      feed = await manager.save(Feed, {
        ...createFeedDto,
        isGroupFeed: true,
      });
      for await (const memberId of memberIdList) {
        await manager.insert(UserFeedMapping, {
          feedId: feed.id,
          userId: memberId,
        });
      }
      await manager.update(User, userId, { lastVistedFeed: feed.id });
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
  ) {
    // 그룹 피드 멤버 2명 이상 100명 미만인지 체크
    if (!memberIdList || memberIdList.length < 2 || memberIdList.length > 100)
      throw new GroupFeedMembersCountError();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        Feed,
        { id: feedId },
        {
          ...createFeedDto,
          isGroupFeed: true,
        },
      );
      const prevMemberList = await manager.find(UserFeedMapping, {
        where: { feedId },
        select: { userId: true },
      });
      const prevMemberIdList = prevMemberList.map((member) => member.userId);
      for await (const userId of memberIdList) {
        if (!memberIdList.includes(userId)) {
          await manager.delete(UserFeedMapping, { userId });
        }
      }

      for await (const userId of memberIdList) {
        if (!prevMemberIdList.includes(userId)) {
          await manager.save(UserFeedMapping, { feedId, userId });
        }
      }
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
