import Cookie from 'src/custom/customDecorator/cookie.decorator';
import {
  FailedToLoginKakaoException,
  FailedToRedirectKakaoException,
} from 'src/error/httpException';
import ValidationPipe422 from 'src/validation';
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AccessAuthGuard } from 'src/common/accesstoken.guard';
import { RefreshAuthGuard } from 'src/common/refreshtoken.guard';
import { UserReq } from './decorators/users.decorators';
import JoinNicknameDto from './dto/join.nickname.dto';
import JoinRequestDto from './dto/join.request.dto';
import UserFacade from './users.facade';
import UsersService from './users.service';
import JoinCookieDto from './dto/join.cookie.dto';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly facade: UserFacade,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
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

  // todo : 환경변수 유효성 검사 controller에서 제거
  @Get('kakao')
  redirectToKakao(@Res() res: Response) {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URL)
      throw new FailedToRedirectKakaoException();

    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`,
    );
  }

  @Get('kakao/callback')
  async loginUser(@Query('code') code: string, @Res() res: Response) {
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

        return res.redirect('http://localhost:3000/signin/info');
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
      return res.redirect('http://localhost:3000/feed');
    } catch (e) {
      throw new FailedToLoginKakaoException();
    }
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logoutUser(@UserReq() user, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.removeRefreshToken(user.id);
    return res.redirect('http://localhost:3001');
  }

  @Post('join')
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Cookie(new ValidationPipe422({ validateCustomDecorators: true }))
    joinCookieDto: JoinCookieDto,
    @Res() res: Response,
  ) {
    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      joinCookieDto.kakaoId,
      joinCookieDto.profilePicture,
    );
    await this.userService.joinUser(joinMember);
    // note : 여기서 userId를 조회하려면 이방법이 최선일까?
    const { kakaoId } = joinCookieDto;
    const user = await this.userService.getUser({
      kakaoId,
    });
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
    return res.redirect('http://localhost:3000/feed');
  }

  @Get('search/:nickname')
  async serachUser(@Param('nickname') nickname: string) {
    const userList = await this.userService.getUserList(nickname, 10);
    return userList;
  }
}
