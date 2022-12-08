import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import {
<<<<<<< HEAD
  AccessAfterDueDateException,
  AccessBeforeDueDateException,
} from '@root/custom/customError/httpException';
=======
  AccessAfterDueDateError,
  AccessBeforeDueDateError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
>>>>>>> main
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


    if (!feed) throw new NonExistFeedError();

    // 포스팅 생성 api
    if (isCreatePostingApi) {
      if (feed.dueDate > new Date()) return true;
      throw new AccessAfterDueDateError();
    }

    // 비 포스팅 생성 api
    if (feed.dueDate < new Date()) return true;
    throw new AccessBeforeDueDateError();
  }
}
