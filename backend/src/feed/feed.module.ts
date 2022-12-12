import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '@root/entities/Feed.entity';
import TypeOrmCustomModule from '@root/common/typeorm/typeorm.module';
import { UserRepository } from '@root/users/users.repository';
import { FeedRepository } from '@feed/feed.repository';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';
import { InvalidFeedName } from '@root/custom/customValidators/feedValidate';
import UsersModule from '@users/users.module';
import { AuthenticationService } from '@root/authentication/authentication.service';
import { FeedController } from '@feed/feed.controller';
import { FeedService } from '@feed/feed.service';
import { UserFeedMappingRepository } from './user.feed.mapping.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed, UserFeedMapping]),
    TypeOrmCustomModule.forCustomRepository([
      FeedRepository,
      UserRepository,
      UserFeedMappingRepository,
    ]),
    UsersModule,
    CacheModule.register({
      store: redisStore,
      host: '127.0.0.1',
      port: 6379,
      ttl: 300,
    }),
  ],
  providers: [FeedService, InvalidFeedName, AuthenticationService, JwtService],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
