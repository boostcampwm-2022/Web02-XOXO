import { Module } from '@nestjs/common';
import { OauthModule } from 'src/oauth/oauth.module';
import UsersController from './users.controller';

@Module({
  imports: [OauthModule],
  controllers: [UsersController],
})
export default class UsersModule {}
