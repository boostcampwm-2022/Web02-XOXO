import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';
import {
  DBError,
  DuplicateKakaoIdError,
  DuplicateNicknameError,
} from 'src/error/serverError';
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
      const InsertedUser = await this.userRepository.save(user);
      return InsertedUser;
    } catch (e) {
      const errorType = e.code;
      if (errorType === 'ER_DUP_ENTRY') {
        if (e.sqlMessage.includes(process.env.DB_UERRS_KAKAOID_UNIQUE))
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
      throw new DBError('DBError: joinUser .save() 오류');
    }
  }
}
