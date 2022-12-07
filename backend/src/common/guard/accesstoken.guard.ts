import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '@root/authentication/authentication.service';
import {
  ExpiredTokenError,
  InvalidTokenError,
  NonExistTokenError,
} from '@root/custom/customError/serverError';

@Injectable()
export class AccessAuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accessToken } = request.cookies;
    if (accessToken === undefined) throw new NonExistTokenError();
    request.user = await this.validateToken(accessToken);
    return true;
  }

  async validateToken(token: string) {
    try {
      const user = await this.authenticationService.verifyToken(token);
      return user;
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
