import { PickType } from '@nestjs/swagger';
import User from '@root/entities/User.entity';
import { createHash } from 'crypto';

export default class JoinRequestDto extends PickType(User, [
  'profile',
  'kakaoId',
  'nickname',
] as const) {
  hashedNickname: string;

  constructor(nickname: string, kakaoId: number, profile: string) {
    super();
    this.nickname = nickname;
    this.kakaoId = kakaoId;
    this.profile = profile;
    this.hashedNickname = this.getHashedNickname();
  }

  getHashedNickname() {
    return createHash('md5').update(this.nickname).digest('hex');
  }
}
