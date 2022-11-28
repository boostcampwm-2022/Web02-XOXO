import { Injectable } from '@nestjs/common';
import { Feed } from 'src/entities/Feed.entity';
import User from 'src/entities/User.entity';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import { NonExistFeedIdException } from 'src/error/httpException';
import {
  DBError,
  GroupFeedMemberListCountException,
  InvalidFKConstraintError,
  NonExistFeedError,
  NonExistUserError,
} from 'src/error/serverError';
import { DataSource } from 'typeorm';
import CreateFeedDto from './dto/create.feed.dto';
import { encrypt } from './feed.utils';

@Injectable()
export class FeedService {
  constructor(private dataSource: DataSource) {}

  async createFeed(createFeedDto: CreateFeedDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const feed = await queryRunner.manager
        .getRepository(Feed)
        .save({ ...createFeedDto, isGroupFeed: false });

      await queryRunner.manager
        .getRepository(UserFeedMapping)
        .save({ feedId: feed.id, userId });

      await queryRunner.commitTransaction();
      return encrypt(feed.id.toString());
    } catch (e) {
      const errorType = e.code;
      await queryRunner.rollbackTransaction();

      if (errorType === 'ER_NO_REFERENCED_ROW_2') throw new NonExistUserError();

      throw new DBError('DBError: createFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }

  async createGroupFeed(createFeedDto: CreateFeedDto, memberIdList: number[]) {
    // 그룹 피드 멤버 2명 이상 100명 미만인지 체크
    if (!memberIdList || memberIdList.length < 2 || memberIdList.length > 100)
      throw new GroupFeedMemberListCountException();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 새로운 피드 생성
      const feed = await queryRunner.manager
        .getRepository(Feed)
        .insert({ ...createFeedDto, isGroupFeed: true });
      const feedId: number = feed.identifiers[0].id;

      // useFeedMappingTable 삽입
      for await (const userId of memberIdList) {
        const id = await queryRunner.manager
          .getRepository(UserFeedMapping)
          .insert({ feedId, userId });
      }
      // await Promise.all(
      //   memberIdList.map(async (userId) => {
      //     await queryRunner.manager
      //       .getRepository(UserFeedMapping)
      //       .insert({ feedId, userId });
      //   }),
      // );
      await queryRunner.commitTransaction();
      return encrypt(feedId.toString());
    } catch (e) {
      const errorType = e.code;
      await queryRunner.rollbackTransaction();

      if (errorType === 'ER_NO_REFERENCED_ROW_2') throw new NonExistUserError();

      throw new DBError('DBError: createGroupFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }

  async editFeed(createFeedDto: CreateFeedDto, feedId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(Feed)
        .update({ id: feedId }, createFeedDto);

      await queryRunner.commitTransaction();
    } catch (e) {
      const errorType = e.code;
      await queryRunner.rollbackTransaction();

      if (errorType === 'ER_NO_REFERENCED_ROW_2') throw new NonExistFeedError();

      throw new DBError('DBError: editFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }

  async editGroupFeed(
    createFeedDto: CreateFeedDto,
    feedId: number,
    memberIdList: number[],
  ) {
    // 그룹 피드 멤버 2명 이상 100명 미만인지 체크
    if (!memberIdList || memberIdList.length < 2 || memberIdList.length > 100)
      throw new GroupFeedMemberListCountException();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 피드 정보 업데이트
      await queryRunner.manager
        .getRepository(Feed)
        .update({ id: feedId }, createFeedDto);

      // 그룹 피드 멤버 정보(user_feed_mapping) 업데이트
      const prevMemberList = await queryRunner.manager
        .getRepository(UserFeedMapping)
        .find({ where: { feedId }, select: { userId: true } });

      const prevMemberIdList = prevMemberList.map((member) => member.userId);

      // 1. 삭제
      for await (const userId of prevMemberIdList) {
        if (!memberIdList.includes(userId)) {
          await queryRunner.manager
            .getRepository(UserFeedMapping)
            .delete({ userId });
        }
      }

      // 2. 추가
      for await (const userId of memberIdList) {
        if (!prevMemberIdList.includes(userId)) {
          await queryRunner.manager
            .getRepository(UserFeedMapping)
            .save({ feedId, userId });
        }
      }

      // Promise.all(
      //   prevMemberIdList
      //     .filter((userId) => !memberIdList.includes(userId))
      //     .map(async (userId) => {
      //       await queryRunner.manager
      //         .getRepository(UserFeedMapping)
      //         .delete({ userId, feedId });
      //     }),
      // );
      // Promise.all(
      //   memberIdList.map(async (userId) => {
      //     await queryRunner.manager
      //       .getRepository(UserFeedMapping)
      //       .save({ feedId, userId });
      //   }),
      // );

      await queryRunner.commitTransaction();
    } catch (e) {
      const errorType = e.code;
      await queryRunner.rollbackTransaction();

      if (errorType === 'ER_NO_REFERENCED_ROW_2')
        throw new InvalidFKConstraintError();

      throw new DBError('DBError: editGroupFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }

  async getGroupFeedList(userId: number) {
    try {
      const subQuery = await this.dataSource
        .createQueryBuilder()
        .select('feedId')
        .from(UserFeedMapping, 'user_feed_mapping')
        .where('user_feed_mapping.feedId = feeds.id')
        .andWhere('user_feed_mapping.userId = :userId', { userId });

      const feedList = await this.dataSource
        .createQueryBuilder()
        .select(['id AS feed_id', 'name AS feed_name', 'thumbnail'])
        .from(Feed, 'feeds')
        .where(`EXISTS (${subQuery.getQuery()})`)
        .andWhere('isGroupFeed = :isGroupFeed', { isGroupFeed: true })
        .setParameters(subQuery.getParameters())
        .execute();

      return feedList;
    } catch (e) {
      const errorType = e.code;

      if (errorType === 'ER_NO_REFERENCED_ROW_2')
        throw new InvalidFKConstraintError();

      throw new DBError('DBError: editGroupFeed 오류');
    }
  }
}
