import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '@root/entities/User.entity';
import {
  UnauthorizedError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
import FindUserDto from '@users/dto/find.user.dto';
import JoinRequestDto from '@users/dto/join.request.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async joinUser(user: JoinRequestDto) {
    const userId = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
    return userId;
  }

  async getUser(findUserInterface: FindUserDto & Record<string, unknown>) {
    const user = await this.userRepository.findOne({
      where: findUserInterface,
    });
    return user;
  }

  async getUserList(nickname: string, maxRecord: number, reqClientId: number) {
    const userList = await this.userRepository
      .createQueryBuilder()
      .select(['id', 'nickname'])
      .where(`MATCH(nickname) AGAINST ('+${nickname}*' IN BOOLEAN MODE)`)
      .limit(maxRecord)
      .execute();
    return userList.filter((user) => user.id !== reqClientId);
  }

  async setCurrentRefreshToken(refreshtoken: string, id: number) {
    await this.userRepository.update(id, {
      currentRefreshToken: refreshtoken,
    });
  }

  async getLastVisitedFeed(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    const { lastVistedFeed } = user;
    if (!lastVistedFeed) throw new NonExistFeedError();
    return lastVistedFeed;
  }

  async getUserIfRefreshTokenMatches(refreshtoken: string, id: number) {
    const user = await this.userRepository.findOneBy({
      currentRefreshToken: refreshtoken,
    });
    if (!user) {
      const hackedUser = await this.userRepository.findOneBy({ id });

      if (!hackedUser) throw new UnauthorizedError();
      await this.userRepository.update(id, { currentRefreshToken: null });
      throw new UnauthorizedError();
    }
    return user;
  }

  async removeRefreshToken(id: number) {
    await this.userRepository.update(id, {
      currentRefreshToken: null,
    });
  }
}
