import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  getCookieWithJwtAccessToken(nickname: string) {
    const payload = { nickname, tokenType: 'accessToken' };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRATION_TIME) * 1000 * 60,
    });
    return {
      accessToken,
      httpOnly: true,
    };
  }

  getCookieWithJwtRefreshToken(nickname: string) {
    const payload = { nickname, tokenType: 'refreshToken' };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
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
