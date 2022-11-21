import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  getCookieWithJwtAccessToken(nickname: string, id: number) {
    const payload = { id, nickname, tokenType: 'accessToken' };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 60 * 1000 * Number(process.env.JWT_EXPIRATION_TIME),
    });
    return {
      accessToken,
      httpOnly: true,
    };
  }

  getCookieWithJwtRefreshToken(nickname: string, id: number) {
    const payload = { id, nickname, tokenType: 'refreshToken' };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      refreshToken,
      httpOnly: true,
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  }
}
