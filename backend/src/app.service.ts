import { Get, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AppService {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    return this.configService.get('PORT');
  }
}
