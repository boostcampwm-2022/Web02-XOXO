import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticationService } from '@root/authentication/authentication.service';
import UsersService from '@users/users.service';
import {
  ExpiredTokenError,
  InvalidTokenError,
  NonExistTokenError,
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
    if (refreshToken === undefined) throw new NonExistTokenError();
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
      switch (error.message) {
        case 'invalid token':
        case 'jwt malformed':
        case 'invalid signature':
          throw new InvalidTokenError();
        case 'jwt expired':
          throw new ExpiredTokenError();
        default:
          throw error;
      }
    }
  }
}
