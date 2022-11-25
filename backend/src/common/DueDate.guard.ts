import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  AccessBeforeDueDateException,
  InvalidPostingId,
} from 'src/error/httpException';
import { PostingService } from 'src/posting/posting.service';

@Injectable()
export class DueDateGuard implements CanActivate {
  constructor(private readonly postingService: PostingService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { postingId } = req.params;

    const posting = await this.postingService.getPosting({ id: postingId });
    if (!posting) throw new InvalidPostingId();

    if (posting[0].feed.dueDate < new Date()) return true;

    throw new AccessBeforeDueDateException();
  }
}
