import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import configuration from '../configuration';
import AppModule from '../src/app.module';
import { ServerErrorHandlingFilter } from '../src/ServerErrorHandlingFilter';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import ValidationPipe422 from '../src/validation';
import UsersModule from '../src/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `${process.cwd()}/config/.${process.env.NODE_ENV}.env`,
          load: [configuration],
          validationSchema: Joi.object({
            NODE_ENV: Joi.string()
              .valid('development', 'production', 'test')
              .required(),
            PORT: Joi.number().required(),
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
          host: 'localhost',
          port: 3306,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: false,
          logging: true,
          keepConnectionAlive: true,
          entities: [`${__dirname}/../src/entities/*.entity{.ts,.js}`],
        }),
        AppModule,
        UsersModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalFilters(
      new ServerErrorHandlingFilter(),
      new HttpExceptionFilter(),
    );
    app.useGlobalPipes(new ValidationPipe422());
    await app.init();
  });

  it('logout을 요청하면 200 상태코드와 함께 홈페이지로 잘 이동하는가', async () => {
    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJoc3NzIiwidG9rZW5UeXBlIjoicmVmcmVzaFRva2VuIiwiaWF0IjoxNjY5NzI3MDQ3LCJleHAiOjIyNzQ1MjcwNDd9.h5XGmNt5_ZeysDDPmRks5WtXPdxEzOKsZjexioVNeO4';
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJoc3NzIiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE2Njk3MjcwNDcsImV4cCI6MTY3MTUyNzA0N30.55Az0IWv9mrCpgb8SEJ7GccUKgnuYFaKb-sIHXud9jc';

    const result = await request(app.getHttpServer())
      .post('/users/logout')
      .set('cookie', `accessToken=${accessToken}; refreshToken=${refreshToken}`)
      .expect(302);
    expect(result).toEqual({ url: 'http:localhost:3001' });
  });
});
