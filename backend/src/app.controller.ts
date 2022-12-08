import { Controller, Get } from '@nestjs/common';
import AppService from './app.service';
import { ResponseEntity } from './common/response/response.entity';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('serverTime')
  getServerTime() {
    return ResponseEntity.OK_WITH_DATA(Date.now());
  }
}
