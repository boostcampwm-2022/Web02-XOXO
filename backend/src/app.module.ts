import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppController from './app.controller';
import AppService from './app.service';
import configuration from '../configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/.${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export default class AppModule {}
