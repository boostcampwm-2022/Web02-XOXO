import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/Users';
import DBError from 'src/error/serverError';
import { Repository } from 'typeorm';
import JoinRequestDto from './dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async getUserByKakaoId(kakaoId: string) {
    const user = await this.userRepository.findOne({
      where: { kakaoId },
    });
    return user;
  }

  async joinUser(user: JoinRequestDto) {
    try {
      const userId = await this.userRepository.save(user);
      return userId;
    } catch (e) {
      throw new DBError('DBError: joinUser .save() 오류');
    }
  }

  async getuserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      where: { nickname },
    });
    return user;
  }
}
