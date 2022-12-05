import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  AccessAfterDueDateException,
  AccessBeforeDueDateException,
  InvalidPostingId,
} from '@root/custom/customError/httpException';
import { PostingService } from '@posting/posting.service';

@Injectable()
export class DueDateGuard implements CanActivate {
  constructor(private readonly postingService: PostingService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { postingId } = req.params;

    const isCreatePostingApi =
      req.route.path === '/posting/:feedId' && req.route.methods.post;

    const posting = await this.postingService.getPosting({ id: postingId });
    if (!posting) throw new InvalidPostingId();

    if (isCreatePostingApi) {
      if (posting[0].feed.dueDate > new Date()) return true;
      throw new AccessAfterDueDateException();
    } else {
      if (posting[0].feed.dueDate < new Date()) return true;
      throw new AccessBeforeDueDateException();
    }
  }
}
