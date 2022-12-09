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
import ResponseEntity from '@root/common/response/response.entity';
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
    return ResponseEntity.OK_WITH_DATA(true);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@UserReq() user: User, @Res() res: Response) {
    const cookies = await this.userFacade.getToken(user.id, user.nickname);

    Object.values(cookies).forEach((cookie) => {
      res.cookie(cookie.getName(), cookie.getValue(), cookie.getOption());
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
      res.cookie(cookie.getName(), cookie.getValue(), cookie.getOption());
    });
    res.redirect(redirectURL);
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logoutUser(@UserReq() user: User, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.removeRefreshToken(user.id);
    return res.redirect(process.env.CLIENT_URL_PREFIX);
  }

  @Post('join')
  async joinUser(
    @Body() joinNicknameDto: JoinNicknameDto,
    @Cookie(new CustomValidationPipe({ validateCustomDecorators: true }))
    joinCookieDto: JoinCookieDto,
    @Res() res: Response,
  ) {
    const cookieList: CookieDto[] = await this.userFacade.joinUser(
      joinCookieDto,
      joinNicknameDto,
    );

    cookieList.forEach((cookie) => {
      res.cookie(cookie.getName(), cookie.getValue(), cookie.getOption());
    });
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
    const res = await this.userFacade.checkIsDuplicateNickname(nickname);
    return ResponseEntity.OK_WITH_DATA(res);
  }
}
