import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import {
  AccessAfterDueDateException,
  AccessBeforeDueDateException,
} from '@root/custom/customError/httpException';
import { FeedService } from '@root/feed/feed.service';

@Injectable()
export class DueDateGuard implements CanActivate {
  constructor(@Inject(FeedService) private readonly feedService: FeedService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { feedId } = req.params;
    const userId = req.user.id;
    const isCreatePostingApi =
      req.route.path === '/posting/:feedId' && req.route.methods.post;
    const feed = await this.feedService.getFeedInfo(feedId, userId);

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
