import { CanActivate, ExecutionContext, Injectable, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import UsersService from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(@Req() req: Request) {
    return true;
  }
}
