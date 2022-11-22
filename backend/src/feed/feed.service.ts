import { Injectable } from '@nestjs/common';
import { Feed } from 'src/entities/Feed.entity';
import User from 'src/entities/User.entity';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import {
  EmptyGroupFeedMemberList,
  NonExistFeedIdException,
  NonExistUserIdException,
} from 'src/error/httpException';
import { DBError, NonExistUserError } from 'src/error/serverError';
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
        .save(createFeedDto);

      await queryRunner.manager
        .getRepository(UserFeedMapping)
        .save({ feedId: feed.id, userId });

      await queryRunner.commitTransaction();
      return encrypt(feed.id.toString());
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();

      throw new DBError('DBError: createFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }

  async createGroupFeed(createFeedDto: CreateFeedDto, memberIdList: number[]) {
    //그룹 피드 멤버 1명 이상인지 체크
    if (!memberIdList || !memberIdList.length)
      throw new EmptyGroupFeedMemberList();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //존재하는 user인지 확인
      for await (const userId of memberIdList) {
        const id = await queryRunner.manager
          .getRepository(User)
          .findOne({ where: { id: userId } });

        if (!id) throw new NonExistUserError();
      }

      //새로운 피드 생성
      const feed = await queryRunner.manager
        .getRepository(Feed)
        .insert(createFeedDto);
      const feedId: number = feed.identifiers[0].id;

      //useFeedMappingTable 삽입
      for await (const userId of memberIdList) {
        const id = await queryRunner.manager
          .getRepository(UserFeedMapping)
          .insert({ feedId, userId });
      }
      await queryRunner.commitTransaction();
      return encrypt(feedId.toString());
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();

      if (e instanceof NonExistUserError) throw new NonExistUserIdException();

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
      const feed = await queryRunner.manager
        .getRepository(Feed)
        .findOne({ where: { id: feedId } });
      if (!feed) throw new NonExistFeedIdException();

      await queryRunner.manager
        .getRepository(Feed)
        .update({ id: feedId }, createFeedDto);

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
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
    //그룹 피드 멤버 1명 이상인지 체크
    if (!memberIdList || !memberIdList.length)
      throw new EmptyGroupFeedMemberList();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //존재하는 user인지 확인
      for await (const userId of memberIdList) {
        const id = await queryRunner.manager
          .getRepository(User)
          .findOne({ where: { id: userId } });

        if (!id) throw new NonExistUserError();
      }

      //존재하는 피드인지 확인
      const feed = await queryRunner.manager
        .getRepository(Feed)
        .findOne({ where: { id: feedId } });
      if (!feed) throw new NonExistFeedIdException();

      //피드 정보 업데이트
      await queryRunner.manager
        .getRepository(Feed)
        .update({ id: feedId }, createFeedDto);

      //그룹 피드 멤버 정보(user_feed_mapping) 업데이트
      const prevMemberList = await queryRunner.manager
        .getRepository(UserFeedMapping)
        .find({ where: { feedId }, select: { userId: true } });

      const prevMemberIdList = prevMemberList.map((member) => member.userId);

      //1. 삭제
      for await (const userId of prevMemberIdList) {
        if (!memberIdList.includes(userId)) {
          await queryRunner.manager
            .getRepository(UserFeedMapping)
            .delete({ userId });
        }
      }

      //2. 추가
      for await (const userId of memberIdList) {
        if (!prevMemberIdList.includes(userId)) {
          await queryRunner.manager
            .getRepository(UserFeedMapping)
            .save({ feedId, userId });
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();

      if (e instanceof NonExistUserError) throw new NonExistUserIdException();

      throw new DBError('DBError: editGroupFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }
}
