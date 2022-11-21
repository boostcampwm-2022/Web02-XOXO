import { Injectable } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entities/Feed.entity';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import {
  NonExistFeedIdException,
  NonExistUserIdException,
} from 'src/error/httpException';
import DBError from 'src/error/serverError';
import { DataSource, Repository } from 'typeorm';
import CreateFeedDto from './dto/create.feed.dto';
import { encrypt } from './feed.utils';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedRepository: Repository<Feed>,
    @InjectRepository(UserFeedMapping)
    private userFeedMapRepository: Repository<UserFeedMapping>,
    private dataSource: DataSource,
  ) {}

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

      if (e.code === 'ER_NO_REFERENCED_ROW_2')
        throw new NonExistUserIdException();

      throw new DBError('DBError: createFeed 오류');
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
}
