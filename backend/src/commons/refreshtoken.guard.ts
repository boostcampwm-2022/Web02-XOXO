import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import UsersService from 'src/users/users.service';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { refreshToken } = request.cookies;
    if (refreshToken === undefined)
      throw new HttpException('Token이 없습니다.', HttpStatus.UNAUTHORIZED);
    request.user = await this.validateToken(refreshToken);
    return true;
  }

  async validateToken(token: string) {
    try {
      const user = await this.authenticationService.verifyToken(token);
      return await this.usersService.getUserIfRefreshTokenMatches(
        token,
        user.id,
      );
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
