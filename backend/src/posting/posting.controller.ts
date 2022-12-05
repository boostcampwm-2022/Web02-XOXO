import { Controller, Param, UseGuards, Get, Post, Body } from '@nestjs/common';
import { DueDateGuard } from '@root/common/guard/DueDate.guard';
import { PostingService } from '@posting/posting.service';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { UserReq } from '@root/users/decorators/users.decorators';
import User from '@root/entities/User.entity';
import { NonExistPostingError } from '@root/custom/customError/serverError';
import { CreatePostingReqDto } from './dto/create.posting.dto';

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
    const res = await this.postingService.createPosting(
      {
        letter: createPostingReq.letter,
        thumbnail: createPostingReq.thumbnail,
        senderId: user.id,
        encryptedFeedId,
      },
      createPostingReq.images,
    );
    return res;
  }

  @Get('/:feedId/:postingId')
  @UseGuards(DueDateGuard)
  testFunction(@Param('postingId') postingId: number) {
    const res = this.postingService.getOnlyPostingById(postingId);
    if (!res) throw new NonExistPostingError();
    return res;
  }
}
