import {
  Body,
  Controller,
  UseGuards,
  Param,
  Patch,
  Post,
  Get,
} from '@nestjs/common';
import { DueDateGuard } from 'src/common/DueDate.guard';

import Feed from 'src/custom/customDecorator/feed.decorator';
import ValidationPipe422 from 'src/validation';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';

import { decrypt } from './feed.utils';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async createPosting(
    @Body('userId') userId: number,
    @Feed(new ValidationPipe422({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const feedParam = await this.feedService.createFeed(createFeedDto, userId);

    return feedParam;
  }

  @Patch('/:feedId')
  async editPosting(
    @Param('feedId') encryptedFeedId: string,
    @Feed(new ValidationPipe422({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const feedId = decrypt(encryptedFeedId);
    await this.feedService.editFeed(createFeedDto, Number(feedId));
    return {
      success: true,
      code: 200,
    };
  }

  @Post('group')
  async createGroupPosting(
    @Body('memberIdList') memberIdList: number[],
    @Feed(new ValidationPipe422({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const encryuptedFeedID = await this.feedService.createGroupFeed(
      createFeedDto,
      memberIdList,
    );

    return encryuptedFeedID;
  }

  @Patch('group/:feedId')
  async editGroupPosting(
    @Param('feedId') encryptedFeedId: string,
    @Body('memberIdList') memberIdList: number[],
    @Feed(new ValidationPipe422({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const feedId = decrypt(encryptedFeedId);
    await this.feedService.editGroupFeed(
      createFeedDto,
      Number(feedId),
      memberIdList,
    );

    return {
      success: true,
      code: 200,
    };
  }

  @Get('group/feedList/:userId')
  async getGroupFeedList(@Param('userId') userId: number) {
    console.log(userId);

    const feedList = await this.feedService.getGroupFeedList(userId);
    return feedList;
  }
}
