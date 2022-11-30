import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessAuthGuard } from '../common/accesstoken.guard';
import { AuthorizationGuard } from '../common/authorization.guard';

import Feed from '../custom/customDecorator/feed.decorator';
import User from '../entities/User.entity';
import { UserReq } from '../users/decorators/users.decorators';
import ValidationPipe422 from '../validation';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';

import { decrypt } from './feed.utils';

@UseGuards(AccessAuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthorizationGuard)
  @Get('test/:feedId')
  test() {}

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

  @Get('list')
  // TODO : user decorator 지금은 user하위에 있는데 따로뺄까...?
  async getPersonalFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getPersonalFeedList(userId);
    const personalFeedList = [];
    feedList.forEach((f) =>
      personalFeedList.push({
        id: f.feed.id,
        name: f.feed.name,
        thumbnail: f.feed.thumbnail,
      }),
    );

    return personalFeedList;
  }

  @Get('group/feedList/:userId')
  async getGroupFeedList(@Param('userId') userId: number) {
    console.log(userId);

    const feedList = await this.feedService.getGroupFeedList(userId);
    return feedList;
  }
}
