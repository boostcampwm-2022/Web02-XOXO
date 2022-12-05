import { Controller, Param, UseGuards, Get } from '@nestjs/common';
import { DueDateGuard } from '@root/common/guard/DueDate.guard';
import { PostingService } from '@posting/posting.service';
import { AccessAuthGuard } from '@root/common/accesstoken.guard';
import { UserReq } from '@root/users/decorators/users.decorators';
import User from '@root/entities/User.entity';
import { CreatePostingReqDto } from './dto/create.posting.dto';

@UseGuards(AccessAuthGuard)
@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

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

  @Get('test/:postingId')
  @UseGuards(DueDateGuard)
  testFunction(@Param('postingId') postingId: number) {
    return postingId;
  }
}
