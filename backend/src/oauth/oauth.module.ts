import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OauthService } from './oauth.service';

@Module({
  imports: [HttpModule],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
