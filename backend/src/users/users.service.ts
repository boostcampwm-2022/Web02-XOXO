import { Injectable } from '@nestjs/common';
import User from '@root/entities/User.entity';
import {
  UnauthorizedError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
import FindUserDto from '@users/dto/find.user.dto';
import JoinRequestDto from '@users/dto/join.request.dto';
import { UserRepository } from '@users/users.repository';

@Injectable()
export default class UsersService {
  constructor(private userRepository: UserRepository) {}

  async joinUser(user: JoinRequestDto) {
    const id = await this.userRepository.joinUser(user);
    return id;
  }

  async getUser(findUserInterface: FindUserDto & Record<string, unknown>) {
    const user = await this.userRepository.findUser(findUserInterface);
    return user;
  }

  async getUserList(nickname: string, maxRecord: number, reqClientId: number) {
    const userList = await this.userRepository.findUserList(
      nickname,
      maxRecord,
      reqClientId,
    );
    return userList.filter((user: User) => user.id !== reqClientId);
  }

  async setCurrentRefreshToken(refreshtoken: string, id: number) {
    await this.userRepository.updateRefreshToken(id, refreshtoken);
  }

  async getLastVisitedFeed(id: number) {
    const user = await this.userRepository.findUser({ id });
    const { lastVistedFeed } = user;
    if (!lastVistedFeed) throw new NonExistFeedError();
    return lastVistedFeed;
  }

  async getUserIfRefreshTokenMatches(refreshtoken: string, id: number) {
    const user = await this.userRepository.findUser({
      currentRefreshToken: refreshtoken,
    });
    if (!user) {
      const hackedUser = await this.userRepository.findUser({ id });
      if (!hackedUser) throw new UnauthorizedError();
      await this.userRepository.updateRefreshToken(id, null);
      throw new UnauthorizedError();
    }
    return user;
  }

  async removeRefreshToken(id: number) {
    await this.userRepository.updateRefreshToken(id, null);
  }
}
