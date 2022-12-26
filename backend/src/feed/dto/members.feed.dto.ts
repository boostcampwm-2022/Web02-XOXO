import { PickType } from '@nestjs/swagger';
import { NonExistMemberError } from '@root/custom/customError/serverError';
import User from '@root/entities/User.entity';

export default class FeedMembersDto extends PickType(User, [
  'id',
  'nickname',
] as const) {
  constructor(user: User) {
    super();
    this.id = user.id;
    this.nickname = user.nickname;
  }

  static createFeedMemberDto(user: User) {
    if (!user) throw new NonExistMemberError();
    return new FeedMembersDto(user);
  }
}
