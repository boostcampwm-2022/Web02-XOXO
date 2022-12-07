import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';

import Feed from '@root/custom/customDecorator/feed.decorator';
import User from '@root/entities/User.entity';
import { UserReq } from '@users/decorators/users.decorators';

import { AuthorizationGuard } from '@root/common/guard/authorization.guard';

import CreateFeedDto from '@feed/dto/create.feed.dto';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';
import { FeedService } from '@feed/feed.service';
import { decrypt } from '@feed/feed.utils';
import ResponseEntity from '@root/common/response/response.entity';

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
    const feedParam = await this.feedService.createFeed(createFeedDto, 1);
    return ResponseEntity.CREATED_WITH_DATA(feedParam);
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
    return ResponseEntity.OK();
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

    return ResponseEntity.CREATED_WITH_DATA(encryptedFeedID);
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

    return ResponseEntity.OK();
  }

  @Get('list')
  // TODO : user decorator 지금은 user하위에 있는데 따로뺄까...?
  async getPersonalFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getPersonalFeedList(userId);
    return ResponseEntity.OK_WITH_DATA(feedList);
  }

  @Get('group/list')
  async getGroupFeedList(@UserReq() user: User) {
    const userId = user.id;
    const feedList = await this.feedService.getGroupFeedList(userId);
    return ResponseEntity.OK_WITH_DATA(feedList);
  }

  @Get('info/:feedId')
  async getFeedInfo(
    @Param('feedId') encryptedId: string,
    @UserReq() user: User,
  ) {
    const feedInfo = await this.feedService.getFeedInfo(encryptedId, user.id);
    return ResponseEntity.OK_WITH_DATA(feedInfo);
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
