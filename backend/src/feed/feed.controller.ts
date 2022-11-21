import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';
import { createCipheriv } from 'crypto';
import { Feed } from 'src/customDecorator/feed.decorator';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async post(
    @Body('userId') userId: number,
    @Feed() createFeedDto: CreateFeedDto,
  ) {
    console.log(userId);
    const feed = await this.feedService.createFeed(createFeedDto, userId);
    return feed.id;
  }
}
