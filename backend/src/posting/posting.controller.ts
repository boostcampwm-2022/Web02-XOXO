import { Controller, Param, UseGuards, Get } from '@nestjs/common';
import { DueDateGuard } from '../common/dueDate.guard';
import { PostingService } from './posting.service';

@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @Get('test/:postingId')
  @UseGuards(DueDateGuard)
  testFunction(@Param('postingId') postingId: number) {
    return postingId;
  }
}
