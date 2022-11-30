import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import UsersService from '../users/users.service';

@Injectable()
export class AccessAuthGuard implements CanActivate {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accessToken } = request.cookies;
    if (accessToken === undefined)
      throw new HttpException('Token이 없습니다.', HttpStatus.UNAUTHORIZED);
    request.user = await this.validateToken(accessToken);
    return true;
  }

  async validateToken(token: string) {
    try {
      const user = await this.authenticationService.verifyToken(token);
      return user;
    } catch (error) {
      console.log(error);
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
