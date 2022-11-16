import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/Users';
import { Repository } from 'typeorm';
import JoinRequestDto from './dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async postUser(data: JoinRequestDto) {
    const user = await this.userRepository.findOne({
      where: { nickname: data.nickname },
    });
    if (user) throw new Error('이미 존재하는 사용자입니다.');
  }
}
