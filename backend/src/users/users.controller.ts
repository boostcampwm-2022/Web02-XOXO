import {
  FailedToLoginKakaoException,
  FailedToRedirectKakaoException,
  InternalDBException,
} from 'src/error/httpException';
import { DBError } from 'src/error/serverError';
import ValidationPipe422 from 'src/validation';
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
import { AccessAuthGuard } from 'src/commons/accesstoken.guard';
import { RefreshAuthGuard } from 'src/commons/refreshtoken.guard';
import User from 'src/entities/User.entity';
import { UserReq } from './decorators/users.decorators';
import JoinNicknameDto from './dto/join.nickname.dto';
import JoinRequestDto from './dto/join.request.dto';
import UserFacade from './users.facade';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly facade: UserFacade,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@UserReq() user, @Res() res: Response) {
    const { accessToken, ...accessTokenOption } =
      this.authenticationService.getCookieWithJwtAccessToken(
        user.nickname,
        user.id,
      );
    const { refreshToken, ...refreshTokenOption } =
      this.authenticationService.getCookieWithJwtRefreshToken(
        user.nickname,
        user.id,
      );
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('refreshToken', refreshToken, refreshTokenOption);
    res.cookie('accessToken', accessToken, accessTokenOption);
    return res.redirect('http://localhost:3001');
  }

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

  @Get('kakao/callback')
  async loginUser(@Query('code') code: string, @Res() res: Response) {
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

    const { accessToken, ...accessTokenOption } =
      this.authenticationService.getCookieWithJwtAccessToken(
        user.nickname,
        user.id,
      );
    const { refreshToken, ...refreshTokenOption } =
      this.authenticationService.getCookieWithJwtRefreshToken(
        user.nickname,
        user.id,
      );
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('refreshToken', refreshToken, refreshTokenOption);
    res.cookie('accessToken', accessToken, accessTokenOption);
    return res.redirect('http://localhost:3001');
  }

  @Post('join')
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

  @UseGuards(AccessAuthGuard)
  @Get('logout')
  async logoutUser(@UserReq() user, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.removeRefreshToken(user.id);
    return res.redirect('http://localhost:3001');
  }
}
