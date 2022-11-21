import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entities/Feed.entity';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import DBError from 'src/error/serverError';
import { Repository } from 'typeorm';
import CreateFeedDto from './dto/create.feed.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedRepository: Repository<Feed>,
    @InjectRepository(UserFeedMapping)
    private userFeedMapRepository: Repository<UserFeedMapping>,
  ) {}

  async createFeed(createFeedReqDto: CreateFeedDto, userId: number) {
    try {
      console.log(createFeedReqDto);
      const feed = await this.feedRepository.save(createFeedReqDto);
      await this.userFeedMapRepository.save({ feedId: feed.id, userId });
      return feed;
    } catch (e) {
      console.log(e);
      throw new DBError('DBError: createFeed .save() 오류');
    }
  }
}
