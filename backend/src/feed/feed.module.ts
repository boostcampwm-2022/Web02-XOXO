import { Module } from '@nestjs/common';
import { Feed } from 'src/entities/Feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserFeedMapping from 'src/entities/UserFeedMapping.entity';
import { InvalidFeedName } from 'src/custom/customValidators/feedValidate';
import UsersModule from 'src/users/users.module';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { JwtService } from '@nestjs/jwt';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, UserFeedMapping]), UsersModule],
  providers: [FeedService, InvalidFeedName, AuthenticationService, JwtService],
  controllers: [FeedController],
})
export class FeedModule {}
