import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmCustomModule from '@root/common/typeorm/typeorm.module';

import { UserRepository } from '@root/users/users.repository';
import UsersService from '@users/users.service';
import configuration from '../../configuration';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          database: process.env.DB_DATABASE,
          synchronize: false,
          logging: true,
          keepConnectionAlive: true,
          entities: [`${process.cwd()}/src/entities/*.entity{.ts,.js}`],
        }),
        TypeOrmCustomModule.forCustomRepository(UserRepository),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('이상한 카카오 아이디를 가지고 조회를 시도하면 null값이 잘 반환이 되는가', async () => {
    expect(service.getUser({ kakaoId: 11111111 })).resolves.toStrictEqual(null);
  });
});
