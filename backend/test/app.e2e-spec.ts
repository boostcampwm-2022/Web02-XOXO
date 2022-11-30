import { Test, TestingModule } from '@nestjs/testing';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import CustomValidationPipe from 'src/customValidationPipe';
import configuration from '../configuration';
import AppModule from '../src/app.module';
import { ServerErrorHandlingFilter } from '../src/ServerErrorHandlingFilter';
import { HttpExceptionFilter } from '../src/http-exception.filter';

import { RefreshAuthGuard } from '../src/common/refreshtoken.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const user = {
    id: 14,
    nickname: '윤정민이지',
    profile: 'http://naver.com',
    kakaoId: 1121243,
    deletedAt: null,
    currentHashedRefreshToken: null,
  };
  const expected = [
    expect.stringMatching(/^refreshToken/),
    expect.stringMatching(/^accessToken/),
  ];
  const mockRefreshAuthGuard: CanActivate = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = user;
      return true;
    }),
  };
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
      ],
    })
      .overrideGuard(RefreshAuthGuard)
      .useValue(mockRefreshAuthGuard)
      .compile();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalFilters(
      new ServerErrorHandlingFilter(),
      new HttpExceptionFilter(),
    );
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();
  });

  it('logout을 요청하면 302 상태코드와 함께 홈페이지로 잘 이동하는가', async () => {
    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJoc3NzIiwidG9rZW5UeXBlIjoicmVmcmVzaFRva2VuIiwiaWF0IjoxNjY5NzI3MDQ3LCJleHAiOjIyNzQ1MjcwNDd9.h5XGmNt5_ZeysDDPmRks5WtXPdxEzOKsZjexioVNeO4';
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJoc3NzIiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE2Njk3MjcwNDcsImV4cCI6MTY3MTUyNzA0N30.55Az0IWv9mrCpgb8SEJ7GccUKgnuYFaKb-sIHXud9jc';

    const result = await request(app.getHttpServer())
      .post('/users/logout')
      .set(
        'cookie',
        `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      );
    expect(result.status).toEqual(302);
    expect(result.headers.location).toContain('http://localhost:3001');
  });

  it('회원가입을 잘 성공하면 cookie에 refresh token, access token을 담고 최종적으로 피드 페이지로 이동하는가', async () => {
    const mockjoinNicknameDto = {
      nickname: faker.name.middleName(),
    };
    const mockjoinCookieDto = {
      kakaoId: faker.datatype.number(),
      profilePicture: 'http://naver.com',
    };
    const result = await request(app.getHttpServer())
      .post('/users/join')
      .send(mockjoinNicknameDto)
      .set(
        'cookie',
        `kakaoId=${mockjoinCookieDto.kakaoId}; profilePicture=${mockjoinCookieDto.profilePicture}`,
      );

    expect(result.status).toEqual(302);
    expect(result.headers.location).toContain('http://localhost:3000/feed');
    expect(result.headers['set-cookie']).toEqual(
      expect.arrayContaining(expected),
    );
  });

  it('refresh token이 유효하다면 새로운 at,rt 쌍을 발급하는가', async () => {
    const result = await request(app.getHttpServer()).post('/users/refresh');

    expect(result.status).toEqual(302);
    expect(result.header.location).toContain('http://localhost:3001');
    expect(result.headers['set-cookie']).toEqual(
      expect.arrayContaining(expected),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
