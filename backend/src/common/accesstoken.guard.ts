<<<<<<< HEAD
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
<<<<<<< HEAD
import { AuthenticationService } from '@root/authentication/authentication.service';
=======
import { AuthenticationService } from '../authentication/authentication.service';
import UsersService from '../users/users.service';
=======
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import {
  ExpiredTokenException,
  InternalServerException,
  InvalidTokenException,
  NoExistTokenException,
} from 'src/error/httpException';
import UsersService from 'src/users/users.service';
>>>>>>> e128001dbee8a8e1c4b6e40e635462770260b602
>>>>>>> main

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
