import { Controller, Param, UseGuards, Get, Post, Query } from '@nestjs/common';
import { DueDateGuard } from '@root/common/guard/duedate.guard';
import { PostingService } from '@posting/posting.service';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { NonExistPostingError } from '@root/custom/customError/serverError';
import ResponseDto from '@root/common/response/response.dto';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';
import PostingScrollDto from './dto/posting.scroll.dto';
import CreatePosting from './decorators/create.posting.decorator';

@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @UseGuards(DueDateGuard, AccessAuthGuard)
  @Post('/:feedId')
  async createPosting(
    @CreatePosting(new CustomValidationPipe({ validateCustomDecorators: true }))
    createPostingDecoratorDto,
  ) {
    const postingId = await this.postingService.createPosting(
      createPostingDecoratorDto,
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
