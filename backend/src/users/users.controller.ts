import { Response } from 'express';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';
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
import Cookie from '@root/custom/customDecorator/cookie.decorator';
import { AuthenticationService } from '@root/authentication/authentication.service';
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { RefreshAuthGuard } from '@root/common/guard/refreshtoken.guard';
import UsersService from '@users/users.service';
import { UserReq } from '@users/decorators/users.decorators';
import JoinNicknameDto from '@users/dto/join.nickname.dto';
import JoinRequestDto from '@users/dto/join.request.dto';
import UserFacade from '@users/users.facade';
import JoinCookieDto from '@users/dto/join.cookie.dto';
import ResponseDto from '@root/common/response/response.entity';
import { createHash } from 'crypto';
import User from '@root/entities/User.entity';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly facade: UserFacade,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @UseGuards(AccessAuthGuard)
  @Get()
  async checkLoginUser() {
    return ResponseDto.OK_WITH_DATA(true);
  }

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

  @Get('kakao')
  redirectToKakao(@Res() res: Response) {
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
    return res.redirect('http://localhost:3000/feeds');
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logoutUser(@UserReq() user, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.removeRefreshToken(user.id);
    return res.redirect('http://localhost:3000');
  }

  @Post('join')
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Cookie(new CustomValidationPipe({ validateCustomDecorators: true }))
    joinCookieDto: JoinCookieDto,
    @Res({ passthrough: true }) res: Response,
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
    return ResponseDto.CREATED();
  }

  @UseGuards(AccessAuthGuard)
  @Get('search/:nickname')
  async serachUser(@Param('nickname') nickname: string) {
    const userList = await this.userService.getUserList(nickname, 10, 10);
    return ResponseDto.OK_WITH_DATA(userList);
  }

  @Get('check/:nickname')
  async checkDuplicateNickname(@Param('nickname') nickname: string) {
    const res = await this.userService.getUser({
      hashedNickname: createHash('md5').update(nickname).digest('hex'),
    });
    return !res;
  }

  @UseGuards(AccessAuthGuard)
  @Get('recent')
  async getLastVistiedFeed(@UserReq() user: User) {
    const { id } = user;
    const lastVisitedFeed = await this.userService.getLastVisitedFeed(id);
    return lastVisitedFeed;
  }
}
