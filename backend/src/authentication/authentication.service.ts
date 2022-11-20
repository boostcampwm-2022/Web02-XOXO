import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  getCookieWithJwtAccessToken(nickname: string) {
    const payload = { nickname, tokenType: 'accessToken' };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      accessToken,
      httpOnly: true,
      maxAge: 60 * 1000 * Number(process.env.JWT_EXPIRATION_TIME),
    };
  }

  getCookieWithJwtRefreshToken(nickname: string) {
    const payload = { nickname, tokenType: 'refreshToken' };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      refreshToken,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  }
}
