import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { errorMonitor } from 'events';
import JoinRequestDto from './dto/join.request.dto';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  redirect(@Res() res) {
    if (process.env.KAKAO_REDIRECT_URL === undefined)
      throw new Error('카카오 로그인 페이지로 이동할 수 없습니다. ');
    return res.redirect(process.env.KAKAO_REDIRECT_URL);
  }

  @Post()
  postUser(@Body() data: JoinRequestDto) {
    this.userService.postUser(data);
  }
}
