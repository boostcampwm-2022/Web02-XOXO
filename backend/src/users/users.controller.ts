import { Controller, Get, Post, Query, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from 'src/oauth/oauth.service';
import { Code } from 'typeorm';
import JoinRequestDto from './dto/join.request.dto';
import UsersService from './users.service';

// todo: api controller 전역에 /api 추가해주는 것
@Controller('users')
export default class UsersController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly userService: UsersService,
  ) {}

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
  async getCode(@Query('code') code, @Res() res: Response) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUserByKakaoId(kakaoId);
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
  }

  @Post('join')
  // TODO : 중복검사를 가드로 할지 아니면 그냥 이 컨트롤러 안에서 코드로 할지 결정해야함.
  async joinUser(@Body('nickname') nickname: string, @Res() res: Response) {
    const userId = await this.userService.joinUser(
      new JoinRequestDto(nickname, 'ddd', 'imgurlㅇㅇㅇㅇ'),
    );
    return userId;
  }
}
