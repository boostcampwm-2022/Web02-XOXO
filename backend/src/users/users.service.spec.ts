import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '@root/entities/User.entity';
import UsersService from './users.service';

class MockUserRepository {
  #data = [
    {
      id: 1,
      nickname: 'testuser',
      profile: 'http://naver.com',
      kakaoId: 11111111,
      deletedAt: null,
    },
  ];

  findOne({ where: findUserInterface }) {
    const data = this.#data.find(
      (v) => v.kakaoId === findUserInterface.kakaoId,
    );
    if (data) return data;
    return null;
  }
}
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('카카오 아이디를 갖고 유저의 정보를 반환할 수 있는가', async () => {
    expect(service.getUser({ kakaoId: 11111111 })).resolves.toStrictEqual({
      id: 1,
      nickname: 'testuser',
      profile: 'http://naver.com',
      kakaoId: 11111111,
      deletedAt: null,
    });
  });
});
