import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Posting from '@root/entities/Posting.entity';
import { PostingController } from '@posting/posting.controller';
import { PostingService } from '@posting/posting.service';
import { AuthenticationService } from '@root/authentication/authentication.service';
import { JwtService } from '@nestjs/jwt';
import { FeedModule } from '@root/feed/feed.module';
import TypeOrmCustomModule from '@root/common/typeorm/typeorm.module';
import { PostingRepository } from '@posting/posting.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posting]),
    FeedModule,
    TypeOrmCustomModule.forCustomRepository([PostingRepository]),
  ],
  controllers: [PostingController],
  providers: [PostingService, AuthenticationService, JwtService],
  exports: [PostingService],
})
export class PostingModule {}
