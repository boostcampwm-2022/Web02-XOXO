import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import { Repository } from 'typeorm';
import User from '@root/entities/User.entity';
import JoinRequestDto from './dto/join.request.dto';
import FindUserDto from './dto/find.user.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async joinUser(user: JoinRequestDto) {
    const userId = await this.createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
    return userId.raw.insertId;
  }

  async findUser(findUserInterface: FindUserDto) {
    const user = await this.findOneBy(findUserInterface);
    return user;
  }

  async updateRefreshToken(id: number, refreshtoken: string) {
    await this.update(id, { currentRefreshToken: refreshtoken });
  }

  async findUserList(nickname: string, maxRecord: number) {
    const userList = await this.createQueryBuilder()
      .select(['id', 'nickname'])
      .where(`MATCH(nickname) AGAINST ('+${nickname}*' IN BOOLEAN MODE)`)
      .limit(maxRecord)
      .execute();
    return userList;
  }

  async updateLastVisitedFeed(id: number, feed: number) {
    await this.update(id, { lastVistedFeed: feed });
  }
}
