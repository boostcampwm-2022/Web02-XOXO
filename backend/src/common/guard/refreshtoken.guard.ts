import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  ExpiredTokenException,
  InternalServerException,
  InvalidTokenException,
  NoExistTokenException,
} from '@root/custom/customError/httpException';

import { AuthenticationService } from '@root/authentication/authentication.service';
import UsersService from '@users/users.service';
import {
  DBError,
  UnauthorizedError,
} from '@root/custom/customError/serverError';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { refreshToken } = request.cookies;
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
    if (refreshToken === undefined) throw new NoExistTokenException();
    request.user = await this.validateToken(refreshToken);
    return true;
  }

  async validateToken(token: string) {
    try {
      const user = await this.authenticationService.verifyToken(token);
      const result = await this.usersService.getUserIfRefreshTokenMatches(
        token,
        user.id,
      );
      return result;
    } catch (error) {
      switch (error.name) {
        case 'JsonWebTokenError':
          throw new InvalidTokenException();
        case 'TokenExpiredError':
          throw new ExpiredTokenException();
        case 'UnauthorizedError':
          throw new UnauthorizedError();
        case 'DBError':
          throw new DBError('DBError 발생');
        default:
          throw new InternalServerException();
      }
    }
  }
}
