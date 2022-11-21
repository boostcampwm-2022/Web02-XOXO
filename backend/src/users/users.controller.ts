import { Controller, Get, Post, Query, Req, Body, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { Cookie } from 'src/customDecorator/cookie.decorator';
import {
  FailedToLoginKakaoException,
  FailedToRedirectKakaoException,
  InternalDBException,
} from 'src/error/httpException';
import DBError from 'src/error/serverError';
import ValidationPipe422 from 'src/validation';
import JoinCookieDto from './dto/join.cookie.dto';
import JoinNicknameDto from './dto/join.nickname.dto';
import UserFacade from './users.facade';

// todo: api controller 전역에 /api 추가해주는 것
@Controller('users')
export default class UsersController {
  constructor(private readonly facade: UserFacade) {}

  @Get('kakao')
  redirectToKakao(@Res() res: Response) {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URL)
      throw new FailedToRedirectKakaoException();

    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`,
    );
  }

  @Get('kakao/callback')
  async loginUser(@Query('code') code, @Res() res: Response) {
    try {
      const { user, profilePicture, kakaoId } =
        await this.facade.getUserInfoFromKakao(code);

      if (!user) {
        res.cookie('kakaoId', kakaoId, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
        res.cookie('profilePicture', profilePicture, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
        res.redirect('http://localhost:3001');
      }
    } catch (err) {
      throw new FailedToLoginKakaoException();
    }

    // 이미 가입한 유저니깐 로그인 처리 -> 토큰 발행
  }

  @Post('join')
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Cookie(new ValidationPipe422({ validateCustomDecorators: true }))
    joinCookieDto: JoinCookieDto,
  ) {
    try {
      await this.facade.createUser({
        joinNicknameDto,
        joinCookieDto,
      });
    } catch (e) {
      if (e instanceof DBError) throw new InternalDBException();
      else throw e;
    }
  }
}
