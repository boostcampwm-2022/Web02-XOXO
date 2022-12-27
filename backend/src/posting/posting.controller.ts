import {
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { DueDateGuard } from '@root/common/guard/duedate.guard';
import { PostingService } from '@posting/posting.service';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { UserReq } from '@root/users/decorators/users.decorators';
import User from '@root/entities/User.entity';
import { NonExistPostingError } from '@root/custom/customError/serverError';
import ResponseDto from '@root/common/response/response.dto';
import { CreatePostingReqDto } from './dto/create.posting.dto';
import PostingScrollDto from './dto/posting.scroll.dto';

@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @UseGuards(DueDateGuard, AccessAuthGuard)
  @Post('/:feedId')
  async createPosting(
    @UserReq() user: User,
    @Param('feedId') encryptedFeedId: string,
    @Body() createPostingReq: CreatePostingReqDto,
  ) {
    const postingId = await this.postingService.createPosting(
      {
        letter: createPostingReq.letter,
        thumbnail: createPostingReq.thumbnail,
        senderId: user.id,
        encryptedFeedId,
      },
      createPostingReq.images,
    );
    return ResponseDto.CREATED_WITH_DATA(postingId);
  }

  @Get('scroll/:feedId')
  async getFeedPostingThumbnail(
    @Param('feedId') encryptedFeedId: string,
    @Query() postingScrollDto: PostingScrollDto,
  ) {
    const postingThumbnailList = await this.postingService.getPostingThumbnails(
      encryptedFeedId,
      postingScrollDto,
    );
    return ResponseDto.OK_WITH_DATA(postingThumbnailList);
  }

  @Get('/:feedId/:postingId')
  @UseGuards(DueDateGuard, AccessAuthGuard)
  async getPosting(
    @Param('postingId') postingId: number,
    @Param('feedId') feedId: string,
  ) {
    const res = await this.postingService.getPosting(postingId, feedId);
    if (!res) throw new NonExistPostingError();
    return ResponseDto.OK_WITH_DATA(res);
  }
}
