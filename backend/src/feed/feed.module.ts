import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Feed } from 'src/entities/Feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserFeedMapping from '../entities/UserFeedMapping.entity';
import { InvalidFeedName } from '../custom/customValidators/feedValidate';
import UsersModule from '../users/users.module';
import { AuthenticationService } from '../authentication/authentication.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, UserFeedMapping]), UsersModule],
  providers: [FeedService, InvalidFeedName, AuthenticationService, JwtService],
  controllers: [FeedController],
})
export class FeedModule {}
