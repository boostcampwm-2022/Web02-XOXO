import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';
import { Feed } from 'src/customDecorator/feed.decorator';
import userIdDto from './dto/create.userId.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async post(
    @Body('userId') userId: number,
    @Feed() createFeedDto: CreateFeedDto,
  ) {
    const id = new userIdDto(userId);
    const feed = await this.feedService.createFeed(createFeedDto, id.userId);
    return feed.id;
  }
}
