import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';
import { Feed } from 'src/customDecorator/feed.decorator';
import userIdDto from './dto/create.userId.dto';
import { decrypt } from './feed.utils';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async createPosting(
    @Body('userId') userId: number,
    @Feed() createFeedDto: CreateFeedDto,
  ) {
    const id = new userIdDto(userId);
    const feedParam = await this.feedService.createFeed(
      createFeedDto,
      id.userId,
    );

    return feedParam;
  }

  @Patch('/:feedId')
  async editPosting(
    @Param('feedId') encryptedFeedId: string,
    @Feed() createFeedDto: CreateFeedDto,
  ) {
    const feedId = decrypt(encryptedFeedId);

    return feedId;
  }
}
