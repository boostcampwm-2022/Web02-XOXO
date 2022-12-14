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
import { AccessAuthGuard } from '@root/common/guard/accesstoken.guard';
import { RefreshAuthGuard } from '@root/common/guard/refreshtoken.guard';
import UsersService from '@users/users.service';
import { UserReq } from '@users/decorators/users.decorators';
import JoinNicknameDto from '@users/dto/join.nickname.dto';
import UserFacade from '@users/users.facade';
import JoinCookieDto from '@users/dto/join.cookie.dto';

import ResponseDto from '@root/common/response/response.dto';
import User from '@root/entities/User.entity';
import CookieDto from './dto/cookie.info.dto';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userFacade: UserFacade,
  ) {}

  @UseGuards(AccessAuthGuard)
  @Get()
  async checkLoginUser() {
    return ResponseDto.OK_WITH_DATA(true);
  }

  @UseGuards(AccessAuthGuard)
  @Get('nickname')
  async getNickname(@UserReq() user: User) {
    return ResponseDto.OK_WITH_DATA(user.nickname);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@UserReq() user: User, @Res() res: Response) {
    const cookies = await this.userFacade.publishToken(user.id, user.nickname);

    Object.values(cookies).forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, cookie.option);
    });
    return res.redirect(process.env.SERVER_URL_PREFIX);
  }

  @Get('kakao')
  redirectToKakao(@Res() res: Response) {
    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`,
    );
  }

  @Get('kakao/callback')
  async loginUser(@Query('code') code: string, @Res() res: Response) {
    const { cookieList, redirectURL } = await this.userFacade.login(code);

    cookieList.forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, cookie.option);
    });
    res.redirect(redirectURL);
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logoutUser(
    @UserReq() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refreshToken', { domain: process.env.SERVICE_DOMAIN });
    res.clearCookie('accessToken', { domain: process.env.SERVICE_DOMAIN });
    await this.userService.removeRefreshToken(user.id);
    return ResponseDto.CREATED_WITH_DATA(true);
  }

  @Post('join')
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Cookie(new CustomValidationPipe({ validateCustomDecorators: true }))
    joinCookieDto: JoinCookieDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieList: CookieDto[] = await this.userFacade.joinUser(
      joinCookieDto,
      joinNicknameDto,
    );

    cookieList.forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, cookie.option);
    });
    return ResponseDto.CREATED();
  }

  @UseGuards(AccessAuthGuard)
  @Get('search/:nickname')
  async serachUser(@Param('nickname') nickname: string, @UserReq() user: User) {
    const userList = await this.userService.getUserList(nickname, 10, user.id);
    return ResponseDto.OK_WITH_DATA(userList);
  }

  @Get('check/:nickname')
  async checkDuplicateNickname(@Param('nickname') nickname: string) {
    const res = await this.userFacade.checkIsDuplicateNickname(nickname);
    return ResponseDto.OK_WITH_DATA(res);
  }
}
