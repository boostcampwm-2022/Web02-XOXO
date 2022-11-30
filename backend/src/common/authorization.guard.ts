import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { FeedService } from '@feed/feed.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly feedService: FeedService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { feedId } = request.params;
    // TODO : 로그인을 하지 않았다는 error
    if (user === undefined)
      throw new HttpException('로그인을 하지 않은 유저입니다.', 401);
    // TODO : url 잘못되어있다는 error
    if (feedId === undefined)
      throw new HttpException('feedId가 없습니다.', 404);
    const ownerId = await this.validateUser(user, feedId);
    return ownerId;
  }

  async validateUser(user, feedId: string): Promise<boolean> {
    const { id } = user;
    const owner = await this.feedService.checkFeedOwner(id, feedId);
    if (id === owner.userId) return id;
    throw new HttpException('해당 피드에 대한 권한이 없습니다.', 401);
  }
}
