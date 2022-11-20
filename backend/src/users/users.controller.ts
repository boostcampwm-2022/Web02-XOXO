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
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AuthGuard } from 'src/commons/auth.guard';
import { OauthService } from 'src/oauth/oauth.service';
import JoinNicknameDto from './dto/join.nickname.dto';
import JoinRequestDto from './dto/join.request.dto';
import UserFacade from './users.facade';
import UsersService from './users.service';

// todo: api controller 전역에 /api 추가해주는 것
@Controller('users')
export default class UsersController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly userService: UsersService,
    private readonly facade: UserFacade,
    private readonly authenticationService: AuthenticationService,
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
  async loginUser(@Query('code') code, @Res() res: Response) {
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
      return res.redirect('http://localhost:3001');
    }
    // 이미 가입한 유저니깐 로그인 처리 -> 토큰 발행
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = this.authenticationService.getJwtTokenwithExpirationTime(user.nickname);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(accessTokenExpires),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(refreshTokenExpires),
    });
    return res.redirect('http://localhost:3001');
  }

  @Post('join')
  // TODO : 중복검사를 가드로 할지 아니면 그냥 이 컨트롤러 안에서 코드로 할지 결정해야함.
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Req() req: Request,
  ) {
    const { kakaoId, profilePicture } = req.cookies;
    if (!kakaoId) throw new BadRequestException('kakaoId가 존재하지 않습니다.');
    if (!profilePicture)
      throw new BadRequestException('profile 이미지가 존재하지 않습니다.');
    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      kakaoId,
      profilePicture,
    );
    const userId = await this.userService.joinUser(joinMember);
    // TODO :  회원가입하고 로그인 처리를 어떻게 할까?
    return userId;
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.userService.logOut();
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(accessTokenExpires),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(refreshTokenExpires),
    });

    return res.redirect('http://localhost:3001');
  }
}
