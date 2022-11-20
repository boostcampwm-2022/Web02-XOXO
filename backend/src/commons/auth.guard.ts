import { CanActivate, ExecutionContext, Injectable, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(@Req() req: Request) {
    const accessToken = req.headers.get('accessToken');
    const payload = this.authenticationService.verifyToken(accessToken);
    console.log(payload);
    return true;
  }
}
