import { Controller, Get, Redirect, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from 'src/oauth/oauth.service';

// todo: api controller 전역에 /api 추가해주는 것
@Controller('users')
export default class UsersController {
  constructor(private readonly oauthService: OauthService) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('kakao')
  redirect(@Res() res: Response) {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URL)
      throw new Error('카카오톡 로그인 실패');

    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`,
    );
  }

  // 로그인 취소..?
  //   HTTP/1.1 302 Found
  // Content-Length: 0
  // Location: ${REDIRECT_URI}?error=access_denied&error_description=User%20denied%20access
  // eslint-disable-next-line class-methods-use-this
  @Get('kakao/callback')
  async getCode(@Query('code') code) {
    const openID = await this.oauthService.getAccessToken(code);
    const validate = await this.oauthService.validateToken(openID);
    return openID;
  }
}
