import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from './authentication/authentication.module';

import { FeedModule } from './feed/feed.module';
import { PostingModule } from './posting/posting.module';
import { ImageModule } from './image/image.module';

import UsersModule from './users/users.module';
import AppController from './app.controller';
import AppService from './app.service';
import configuration from '../configuration';

const envFilePathPrevfix =
  process.env.NODE_ENV === 'production' ? '/root' : process.cwd();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${envFilePathPrevfix}/config/.${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_REDIRECT_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    }),
    UsersModule,
    AuthenticationModule,

    FeedModule,

    PostingModule,

    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export default class AppModule {}
