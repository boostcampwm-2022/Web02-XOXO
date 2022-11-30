import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import {
  ExpiredTokenException,
  InternalServerException,
  InvalidTokenException,
  NoExistTokenException,
} from 'src/error/httpException';
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
    if (refreshToken === undefined) throw new NoExistTokenException();
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
          throw new InvalidTokenException();
        case 'jwt expired':
          throw new ExpiredTokenException();
        default:
          throw new InternalServerException();
      }
    }
  }
}
