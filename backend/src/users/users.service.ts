import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hash, compare } from 'bcrypt';

import User from 'src/entities/User.entity';
import { DBError } from 'src/error/serverError';
import { Repository } from 'typeorm';
import JoinRequestDto from './dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserByKakaoId(kakaoId: number) {
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

  async setCurrentRefreshToken(refreshtoken: string, id: number) {
    const currentHashedRefreshToken = await hash(refreshtoken, 10);
    await this.userRepository.update(id, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshtoken: string, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('권한이 인증되지 않았습니다.', 401);
    const isRefreshTokenMatched = await compare(
      refreshtoken,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenMatched)
      throw new HttpException('권한이 인증되지 않았습니다.', 401);
    return user;
  }

  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }
}
