import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';
import DBError from 'src/error/serverError';
import { Repository } from 'typeorm';
import JoinRequestDto from './dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async getuserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }
}
