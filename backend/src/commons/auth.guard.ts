import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

  validateRequest(request: Request) {
    return true;
  }
}
