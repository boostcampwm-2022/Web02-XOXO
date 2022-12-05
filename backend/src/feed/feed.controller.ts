import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessAuthGuard } from '@root/common/accesstoken.guard';

import Feed from '@root/custom/customDecorator/feed.decorator';
import User from '@root/entities/User.entity';
import { UserReq } from '@users/decorators/users.decorators';

import { AuthorizationGuard } from 'src/common/authorization.guard';

import CreateFeedDto from '@feed/dto/create.feed.dto';
import CustomValidationPipe from '@root/customValidationPipe';
import { FeedService } from '@feed/feed.service';
import { decrypt } from '@feed/feed.utils';

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

  @Get('info/:feedId')
  async getFeedInfo(@Param('feedId') encryptedId: string) {
    const feedInfo = await this.feedService.getFeedById(encryptedId);
    return feedInfo;
  }

  @Get('scroll/:feedId')
  async getFeedPostingThumbnail(
    @Param('feedId') encryptedId: string,
    @Body('startPostingId')
    startPostingId: number,
  ) {
    const postingThumbnailList = await this.feedService.getPostingThumbnails(
      encryptedId,
      startPostingId,
    );
    return postingThumbnailList;
  }
}
