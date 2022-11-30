import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Posting from '@root/entities/Posting.entity';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posting])],
  controllers: [PostingController],
  providers: [PostingService],
  exports: [PostingService],
})
export class PostingModule {}
