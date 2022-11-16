import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { OauthService } from './oauth.service';

@Module({
  imports: [HttpModule, JwtModule],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
