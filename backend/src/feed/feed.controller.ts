import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AccessAuthGuard } from 'src/common/accesstoken.guard';

import Feed from 'src/custom/customDecorator/feed.decorator';
import User from 'src/entities/User.entity';
import { UserReq } from 'src/users/decorators/users.decorators';
import CustomValidationPipe from 'src/customValidationPipe';
import { AuthorizationGuard } from 'src/common/authorization.guard';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';

import { decrypt } from './feed.utils';

@UseGuards(AccessAuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async createFeed(
    @UserReq() user: User,
    @Feed(new CustomValidationPipe({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const feedParam = await this.feedService.createFeed(createFeedDto, user.id);
    return feedParam;
  }

  @UseGuards(AuthorizationGuard)
  @Patch('/:feedId')
  async editFeed(
    @Param('feedId') encryptedFeedId: string,
    @Feed(new CustomValidationPipe({ validateCustomDecorators: true }))
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
  async createGroupFeed(
    @UserReq() user: User,
    @Body('memberIdList') memberIdList: number[],
    @Feed(new CustomValidationPipe({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const encryptedFeedID = await this.feedService.createGroupFeed(
      createFeedDto,
      [...memberIdList, user.id],
    );

    return encryptedFeedID;
  }

  @UseGuards(AuthorizationGuard)
  @Patch('group/:feedId')
  async editGroupFeed(
    @UserReq() user: User,
    @Param('feedId') encryptedFeedId: string,
    @Body('memberIdList') memberIdList: number[],
    @Feed(new CustomValidationPipe({ validateCustomDecorators: true }))
    createFeedDto: CreateFeedDto,
  ) {
    const feedId = decrypt(encryptedFeedId);
    await this.feedService.editGroupFeed(createFeedDto, Number(feedId), [
      ...memberIdList,
      user.id,
    ]);

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
    return feedList;
  }

  @Get('group/list')
  async getGroupFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getGroupFeedList(userId);
    return feedList;
  }
}
