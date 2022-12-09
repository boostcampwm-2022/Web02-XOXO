import { Controller, Get } from '@nestjs/common';
import AppService from './app.service';
import { ResponseDto } from './common/response/response.dto';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('serverTime')
  getServerTime() {
    return ResponseDto.OK_WITH_DATA(Date.now());
  }
}
