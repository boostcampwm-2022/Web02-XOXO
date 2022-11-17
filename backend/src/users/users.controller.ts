import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Body,
  Res,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { OauthService } from 'src/oauth/oauth.service';
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
  redirectToKakao(@Res() res: Response) {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URL)
      // 상태코드를 뭐로 해야할지 모르겠음. 리다이렉션 실패는 어떻게 해야할까
      throw new HttpException(
        '카카오톡 로그인으로 리다이렉트를 실패했습니다.',
        500,
      );

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
    // 이미 가입한 유저니깐 로그인 처리
  }

  @Post('join')
  // TODO : 중복검사를 가드로 할지 아니면 그냥 이 컨트롤러 안에서 코드로 할지 결정해야함.
  async joinUser(@Body('nickname') nickname: string, @Req() req: Request) {
    const { kakaoId, profilePicture } = req.cookies;
    if (!kakaoId) throw new BadRequestException('kakaoId가 없습니다.');
    if (!profilePicture)
      throw new BadRequestException('profilePicture가 없습니다.');
    const userId = await this.userService.joinUser(
      new JoinRequestDto(nickname, kakaoId, profilePicture),
    );
    return userId;
  }
}
