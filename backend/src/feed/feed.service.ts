import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Feed } from 'src/entities/Feed.entity';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import DBError from 'src/error/serverError';
import { DataSource, Repository } from 'typeorm';
import CreateFeedDto from './dto/create.feed.dto';

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
      return feed;
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new DBError('DBError: createFeed 오류');
    } finally {
      await queryRunner.release();
    }
  }
}
