import { Controller, Get, Post, Query, Req, Body, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import {
  FailedToLoginKakao,
  FailedToRedirectKakao,
} from 'src/error/httpException';
import JoinNicknameDto from './dto/join.nickname.dto';
import UserFacade from './users.facade';

// todo: api controller 전역에 /api 추가해주는 것
@Controller('users')
export default class UsersController {
  constructor(private readonly facade: UserFacade) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('kakao')
  redirectToKakao(@Res() res: Response) {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URL)
      throw new FailedToRedirectKakao();

    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`,
    );
  }

  // eslint-disable-next-line class-methods-use-this
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
      throw new Error();
    } catch (err) {
      throw new FailedToLoginKakao();
    }

    // 이미 가입한 유저니깐 로그인 처리 -> 토큰 발행
  }

  @Post('join')
  // TODO : 중복검사를 가드로 할지 아니면 그냥 이 컨트롤러 안에서 코드로 할지 결정해야함.
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Req() req: Request,
  ) {
    const { kakaoId, profilePicture } = req.cookies;
    await this.facade.createUser({ joinNicknameDto, kakaoId, profilePicture });
  }
}
