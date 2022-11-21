import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { accessToken } = request.cookies;
    if (accessToken === undefined)
      throw new HttpException('Token이 없습니다.', HttpStatus.UNAUTHORIZED);

    request.user = this.validateToken(accessToken);
    return true;
  }

  validateToken(token: string) {
    try {
      const user = this.authenticationService.verifyToken(token);
      return user.nickname;
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
        case 'jwt malformed':
        case 'invalid signature':
          throw new HttpException('유효하지 않은 토큰입니다. ', 401);
        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);
        default:
          throw new HttpException('서버 에러입니다.', 500);
      }
    }
  }
}
