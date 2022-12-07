import { Controller, Param, UseGuards, Get, Post, Body } from '@nestjs/common';
import { DueDateGuard } from '@root/common/guard/DueDate.guard';
import { PostingService } from '@posting/posting.service';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { UserReq } from '@root/users/decorators/users.decorators';
import User from '@root/entities/User.entity';
import { NonExistPostingError } from '@root/custom/customError/serverError';
import ResponseEntity from '@root/common/response/response.entity';
import { CreatePostingReqDto } from './dto/create.posting.dto';
import ResponseEntity from '@root/common/response/response.entity';

@UseGuards(AccessAuthGuard)
@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @UseGuards(DueDateGuard)
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
    return ResponseEntity.CREATED_WITH_DATA(postingId);
  }

  @Get('/:feedId/:postingId')
  @UseGuards(DueDateGuard)
  async lookingPosting(
    @Param('postingId') postingId: number,
    @Param('feedId') feedId: string,
  ) {
    const res = await this.postingService.getOnlyPostingById(postingId, feedId);
    if (!res) throw new NonExistPostingError();
    return ResponseEntity.OK_WITH_DATA(res);
  }
}
