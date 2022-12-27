import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';

import Feed from '@root/custom/customDecorator/feed.decorator';
import User from '@root/entities/User.entity';
import { UserReq } from '@users/decorators/users.decorators';

import { AuthorizationGuard } from '@root/common/guard/authorization.guard';

import CreateFeedDto from '@feed/dto/create.feed.dto';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';
import { FeedService } from '@feed/feed.service';
import { decrypt, encrypt } from '@feed/feed.utils';
import ResponseDto from '@root/common/response/response.dto';
import FeedScrollDto from './dto/request/feed.scroll.dto';

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
    const userId = user.id;
    const feedParam = await this.feedService.createFeed(createFeedDto, userId);
    return ResponseDto.CREATED_WITH_DATA(feedParam);
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
    return ResponseDto.OK();
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
      [...new Set([...memberIdList, user.id])],
      user.id,
    );

    return ResponseDto.CREATED_WITH_DATA(encryptedFeedID);
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
      ...new Set([...memberIdList, user.id]),
    ]);

    return ResponseDto.OK();
  }

  @Get('list')
  async getPersonalFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getPersonalFeedList(userId);
    return ResponseDto.OK_WITH_DATA(feedList);
  }

  @Get('group/list')
  async getGroupFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getGroupFeedList(userId);
    return ResponseDto.OK_WITH_DATA(feedList);
  }

  @UseGuards(AccessAuthGuard)
  @Get('info/:feedId')
  async getFeedInfo(
    @Param('feedId') encryptedId: string,
    @UserReq() user: User,
  ) {
    const userId = user.id;
    const feedInfo = await this.feedService.getFeedInfo(encryptedId, userId);
    return ResponseDto.OK_WITH_DATA(feedInfo);
  }

  @UseGuards(AuthorizationGuard)
  @Get('members/:feedId')
  async getFeedMemberList(
    @Param('feedId') encryptedId: string,
    @UserReq() user: User,
  ) {
    const userId = user.id;
    const feedMemberList = await this.feedService.getFeedMemberList(
      encryptedId,
      userId,
    );
    return ResponseDto.OK_WITH_DATA(feedMemberList);
  }
}
