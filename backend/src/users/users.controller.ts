import { Controller, Get, Redirect, Query } from '@nestjs/common';

@Controller('users')
export default class UsersController {
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: process.env.URL };
    }
  }
}
