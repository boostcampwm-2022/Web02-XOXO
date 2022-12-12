import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TypeOrmCustomModule from '@root/common/typeorm/typeorm.module';
import { UserRepository } from '@root/users/users.repository';
import { FeedRepository } from '@feed/feed.repository';
import { InvalidFeedName } from '@root/custom/customValidators/feedValidate';
import UsersModule from '@users/users.module';
import { AuthenticationService } from '@root/authentication/authentication.service';
import { FeedController } from '@feed/feed.controller';
import { FeedService } from '@feed/feed.service';
import { UserFeedMappingRepository } from './user.feed.mapping.repository';

@Module({
  imports: [
    TypeOrmCustomModule.forCustomRepository([
      FeedRepository,
      UserRepository,
      UserFeedMappingRepository,
    ]),
    UsersModule,
  ],

  providers: [FeedService, InvalidFeedName, AuthenticationService, JwtService],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
