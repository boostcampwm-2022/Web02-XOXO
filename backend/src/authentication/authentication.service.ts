import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getJwtTokenwithExpirationTime(nickname: string) {
    const accessTokenPayload = { nickname, tokenType: 'accessToken' };
    const refreshTokenPayload = { nickname, tokenType: 'refreshToken' };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const accessTokenExpires =
      Date.now() + 1000 * 60 * this.configService.get('JWT_EXPIRATION_TIME');
    const refreshTokenExpires = Date.now() + 1000 * 60 * 60 * 24 * 7;
    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return payload;
  }
}
