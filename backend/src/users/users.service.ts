import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '@root/entities/User.entity';
import {
  DBError,
  DuplicateKakaoIdError,
  UnauthorizedError,
  DuplicateNicknameError,
} from '@root/custom/customError/serverError';
import FindUserDto from '@users/dto/find.user.dto';
import JoinRequestDto from '@users/dto/join.request.dto';

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
      const errorType = e.code;
      if (errorType === 'ER_DUP_ENTRY') {
        if (e.sqlMessage.includes(process.env.DB_USERS_KAKAOID_UNIQUE))
          throw new DuplicateKakaoIdError();
        else throw new DuplicateNicknameError();
      }
      throw new DBError('DBError: joinUser .save() 오류');
    }
  }

  async getUser(findUserInterface: FindUserDto & Record<string, unknown>) {
    try {
      const user = await this.userRepository.findOne({
        where: findUserInterface,
      });
      return user;
    } catch (e) {
      throw new DBError('DBError: getUser 오류');
    }
  }

  async getUserList(nickname: string, maxRecord: number, reqClientId: number) {
    try {
      const userList = await this.userRepository
        .createQueryBuilder()
        .select(['id', 'nickname'])
        .where(`MATCH(nickname) AGAINST ('+${nickname}*' IN BOOLEAN MODE)`)
        .limit(maxRecord)
        .execute();
      return userList.filter((user) => user.id !== reqClientId);
    } catch (e) {
      throw new DBError('DBError: getUserList 오류');
    }
  }

  async setCurrentRefreshToken(refreshtoken: string, id: number) {
    try {
      await this.userRepository.update(id, {
        currentRefreshToken: refreshtoken,
      });
    } catch (e) {
      throw new DBError('DBError: setCurrentRefreshToken error');
    }
  }

  async getLastVisitedFeed(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return user.lastVistedFeed;
      throw new UnauthorizedError();
    } catch (e) {
      console.log(e.type);
      switch (e.type) {
        case 'UnauthorizedError':
          throw new UnauthorizedError();
        default:
          throw new DBError('DBError: getLastVisitedFeed error');
      }
    }
  }

  async getUserIfRefreshTokenMatches(refreshtoken: string, id: number) {
    try {
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
    } catch (e) {
      console.log(e.type);
      switch (e.type) {
        case 'UnauthorizedError':
          throw new UnauthorizedError();
        default:
          throw new DBError('DBError: getLastVisitedFeed error');
      }
    }
  }

  async removeRefreshToken(id: number) {
    try {
      await this.userRepository.update(id, {
        currentRefreshToken: null,
      });
    } catch (e) {
      throw new DBError('DBError: removeRefreshToken 오류');
    }
  }
}
