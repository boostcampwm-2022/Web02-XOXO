import { PickType } from '@nestjs/swagger';
import User from '../../entities/User.entity';

export default class JoinRequestDto extends PickType(User, [
  'profile',
  'kakaoId',
  'nickname',
] as const) {
  constructor(nickname: string, kakaoId: number, profile: string) {
    super();
    this.nickname = nickname;
    this.kakaoId = kakaoId;
    this.profile = profile;
  }
}
