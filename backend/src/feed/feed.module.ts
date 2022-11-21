import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Feed } from 'src/entities/Feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import { InvalidFeedName } from 'src/customValidators/feedValidate';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, UserFeedMapping])],
  providers: [FeedService, InvalidFeedName],
  controllers: [FeedController],
})
export class FeedModule {}
