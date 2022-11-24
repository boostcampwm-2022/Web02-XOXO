import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hash, compare } from 'bcrypt';

import User from 'src/entities/User.entity';
import { DBError } from 'src/error/serverError';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/find.user.dto';
import JoinRequestDto from './dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async joinUser(user: JoinRequestDto) {
    try {
      const userId = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
      return userId;
    } catch (e) {
      throw new DBError('DBError: joinUser.insert() 오류');
    }
  }

  async getUser(findUserInterface: FindUserDto & Record<string, unknown>) {
    try {
      const user = await this.userRepository.findOne({
        where: findUserInterface,
      });
      return user;
    } catch (e) {
      throw new DBError('DBError: joinUser .save() 오류');
    }
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
