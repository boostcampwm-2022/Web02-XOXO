import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import {
  AccessAfterDueDateException,
  AccessBeforeDueDateException,
  InvalidPostingId,
} from '@root/custom/customError/httpException';
import { PostingService } from '@posting/posting.service';
import { FeedService } from '@root/feed/feed.service';

@Injectable()
export class DueDateGuard implements CanActivate {
  constructor(@Inject(FeedService) private readonly feedService: FeedService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { feedId } = req.params;

    const isCreatePostingApi =
      req.route.path === '/posting/:feedId' && req.route.methods.post;
    const feed = await this.feedService.getFeedById(feedId);

    // 포스팅 생성 api
    if (isCreatePostingApi) {
      if (feed.dueDate > new Date()) return true;
      throw new AccessAfterDueDateException();
    }

    // 비 포스팅 생성 api
    if (feed.dueDate < new Date()) return true;
    throw new AccessBeforeDueDateException();
  }
}
