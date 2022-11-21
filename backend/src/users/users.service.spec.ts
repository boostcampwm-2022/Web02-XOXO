import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Users from '../entities/Users';
import UsersService from './users.service';

class MockUserRepository {
  #data = [
    { id: 1, nickname: 'nickname', kakaoId: 'kakaoId', profile: 'profile' },
  ];

  findOne({ where: { kakaoId } }) {
    const data = this.#data.find((v) => v.kakaoId === kakaoId);
    if (data) {
      return data;
    }
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
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('회원가입이 잘 이루어지는가 ', () => {});
  it('카카오 아이디를 통해 유저를 잘 반환하는가', () => {
    expect(service.getUserByKakaoId('kakaoId')).resolves.toStrictEqual({
      id: 1,
      nickname: 'nickname',
      profile: 'profile',
      kakaoId: 'kakaoId',
    });
  });

  it('RT를 10자리로 해시화해서 DB에 잘 반영을 시키는가', () => {});
  it('가입되어 있지 않은 사용자가 db를 조회하고자 하면 예외를 터뜨리는가', () => {});
  it('refreshtoken이 악의적인 사용자에 의해 변환이 되어 있다면 예외를 터뜨리는가', () => {});
  it('정상적인 refreshtoken으로 조회를 한다면 알맞은 user정보를 반환하는가', () => {});
  it('로그아웃을 하면 refreshtoken 값을 null로 변환하는가', () => {});
});
