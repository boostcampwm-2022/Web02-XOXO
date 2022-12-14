import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { FeedService } from '@feed/feed.service';
import { decrypt } from '@feed/feed.utils';
import {
  NonExistFeedError,
  NonExistTokenError,
  UnauthorizedError,
} from '@root/custom/customError/serverError';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly feedService: FeedService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // TODO : 로그인을 하지 않았다는 error
    if (!('user' in request)) throw new NonExistTokenError();
    // TODO : url 잘못되어있다는 error
    if (!('feedId' in request.params)) throw new NonExistFeedError();

    const { user } = request;
    const feedId = decrypt(request.params.feedId);

    const ownerId = await this.validateUser(user, feedId);
    return ownerId;
  }

  async validateUser(user, feedId: string): Promise<boolean> {
    const { id } = user;
    const owner = await this.feedService.checkFeedOwner(id, feedId);
    if (id === owner.userId) return id;
    throw new UnauthorizedError();
  }
}
