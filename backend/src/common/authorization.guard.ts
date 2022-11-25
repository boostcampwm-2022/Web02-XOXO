import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import UsersService from 'src/users/users.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    console.log('request', request.user);
    return true;
  }
}
