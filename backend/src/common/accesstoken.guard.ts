import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from '@root/authentication/authentication.service';
import {
  InvalidTokenException,
  ExpiredTokenException,
  InternalServerException,
  NoExistTokenException,
} from '@root/src/error/httpException';

@Injectable()
export class AccessAuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accessToken } = request.cookies;
    if (accessToken === undefined) throw new NoExistTokenException();
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
          throw new InvalidTokenException();
        case 'jwt expired':
          throw new ExpiredTokenException();
        default:
          throw new InternalServerException();
      }
    }
  }
}
