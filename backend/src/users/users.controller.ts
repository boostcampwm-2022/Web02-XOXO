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
import ResponseEntity from '@root/common/response/response.entity';
import User from '@root/entities/User.entity';
import { createHash } from 'crypto';

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
    return ResponseEntity.OK_WITH_DATA(true);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@UserReq() user: User, @Res() res: Response) {
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
    const lastVisitedFeed = user.lastVistedFeed;
    return ResponseEntity.OK_WITH_DATA(lastVisitedFeed);
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logoutUser(@UserReq() user: User, @Res() res: Response) {
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
    @Res() res: Response,
  ) {
    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      joinCookieDto.kakaoId,
      joinCookieDto.profilePicture,
    );
    const userId = await this.userService.joinUser(joinMember);

    const { accessToken, ...accessTokenOption } =
      this.authenticationService.getCookieWithJwtAccessToken(
        joinMember.nickname,
        userId,
      );
    const { refreshToken, ...refreshTokenOption } =
      this.authenticationService.getCookieWithJwtRefreshToken(
        joinMember.nickname,
        userId,
      );
    await this.userService.setCurrentRefreshToken(refreshToken, userId);
    res.cookie('refreshToken', refreshToken, refreshTokenOption);
    res.cookie('accessToken', accessToken, accessTokenOption);
    res.send(ResponseEntity.CREATED());
  }

  @UseGuards(AccessAuthGuard)
  @Get('search/:nickname')
  async serachUser(@Param('nickname') nickname: string, @UserReq() user: User) {
    const { id } = user;
    const userList = await this.userService.getUserList(nickname, 10, id);
    return ResponseEntity.OK_WITH_DATA(userList);
  }

  @Get('check/:nickname')
  async checkDuplicateNickname(@Param('nickname') nickname: string) {
    const res = await this.userService.getUser({
      hashedNickname: createHash('md5').update(nickname).digest('hex'),
    });
    if (res) {
      return ResponseEntity.OK_WITH_DATA(true);
    }
    return ResponseEntity.OK_WITH_DATA(false);
  }
}
