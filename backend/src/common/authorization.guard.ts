import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  NoExistTokenException,
  NoFeedIdException,
  UnauthorizedException,
} from 'src/error/httpException';

<<<<<<< HEAD
import { FeedService } from '@feed/feed.service';
=======
<<<<<<< HEAD
import { FeedService } from '../feed/feed.service';
=======
import { FeedService } from 'src/feed/feed.service';
import { decrypt } from 'src/feed/feed.utils';
>>>>>>> e128001dbee8a8e1c4b6e40e635462770260b602
>>>>>>> main

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly feedService: FeedService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // TODO : 로그인을 하지 않았다는 error
    if (!('user' in request)) throw new NoExistTokenException();
    // TODO : url 잘못되어있다는 error
    if (!('feedId' in request.params)) throw new NoFeedIdException();

    const { user } = request;
    const feedId = decrypt(request.params.feedId);

    const ownerId = await this.validateUser(user, feedId);
    return ownerId;
  }

  async validateUser(user, feedId: string): Promise<boolean> {
    const { id } = user;
    const owner = await this.feedService.checkFeedOwner(id, feedId);
    if (id === owner.userId) return id;
    throw new UnauthorizedException();
  }
}
