import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import configuration from 'configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerErrorHandlingFilter } from '@root/ServerErrorHandlingFilter';
import { HttpExceptionFilter } from '@root/http-exception.filter';
import { DataSource } from 'typeorm';
<<<<<<< HEAD
import { Feed } from '@root/entities/Feed.entity';
import { FeedModule } from '@feed/feed.module';
import { FeedService } from '@feed/feed.service';
import { decrypt } from '@feed/feed.utils';
=======
import { Feed } from 'src/entities/Feed.entity';
import { UserReq } from 'src/users/decorators/users.decorators';
import { AccessAuthGuard } from 'src/common/accesstoken.guard';
import { AuthorizationGuard } from 'src/common/authorization.guard';
import { NonExistUserError } from 'src/error/serverError';
import { FeedModule } from './feed.module';
import { FeedService } from './feed.service';
import { decrypt } from './feed.utils';
>>>>>>> main

describe('FeedController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let feedService: FeedService;
  const mockUser = {
    id: 1,
    nickname: '윤정민이지',
    profile: 'http://naver.com',
    kakaoId: 1121243,
    deletedAt: null,
    currentHashedRefreshToken: null,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `${process.cwd()}/config/.${process.env.NODE_ENV}.env`,
          load: [configuration],
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: 'xoxo_test',
          synchronize: false,
          logging: true,
          keepConnectionAlive: true,
          entities: [`${__dirname}/../entities/*.entity{.ts,.js}`],
        }),
        FeedModule,
      ],
    })
      .useMocker((token) => {
        if (token === UserReq) return mockUser;
      })
      .overrideGuard(AccessAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthorizationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new ServerErrorHandlingFilter(),
      new HttpExceptionFilter(),
    );
    dataSource = moduleFixture.get(DataSource);
    feedService = moduleFixture.get(FeedService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    dataSource.createQueryBuilder().delete().from(Feed).execute();
  });

  it('/feed 개인 피드 생성(unit) : 정상 동작일 시 디비 삽입 확인', async () => {
    const mockCreateFeedDto = {
      name: '피드 이름 2',
      thumbnail: 'naver.com',
      description: '피드 1 설명',
      dueDate: new Date('2022-11-20'),
    };

    const mockUserId = 1;

    const encryptedId = await feedService.createFeed(
      mockCreateFeedDto,
      mockUserId,
    );
    const res = await dataSource
      .getRepository(Feed)
      .find({ where: { id: Number(decrypt(encryptedId)) } });

    expect(res.length).toBe(1);
    expect(res[0]).toEqual(expect.objectContaining(mockCreateFeedDto));
  });

  it(`/feed 개인 피드 생성(e2e) : 피드 이름 유효성 검사`, async () => {
    const mockCreateFeedDto = {
      name: '피드 이름이 열자 이상 입니다용',
      thumbnail: 'naver.com',
      description: '피드 1 설명',
      dueDate: new Date(),
    };

    return request(app.getHttpServer())
      .post('/feed')
      .send(mockCreateFeedDto)
      .expect(HttpStatus.CONFLICT)
      .expect((res) => {
        expect(res.body.data.error).toBe('InvalidFeedName');
      });
  });

  it(`/feed 개인 피드 생성(unit) : 유효한 user_id인지 검사`, async () => {
    const mockCreateFeedDto = {
      name: '피드 이름',
      thumbnail: 'naver.com',
      description: '피드 1 설명',
      dueDate: new Date(),
    };

    const mockUserId = 1000;
    await expect(async () => {
      await feedService.createFeed(mockCreateFeedDto, mockUserId);
    }).rejects.toThrowError(new NonExistUserError());
  });
});
