import { PickType } from '@nestjs/swagger';
import User from 'src/entities/User.entity';

export default class JoinRequestDto extends PickType(User, [
  'profile',
  'kakaoId',
  'nickname',
] as const) {
  constructor(nickname: string, kakaoId: string, profile: string) {
    super();
    this.nickname = nickname;
    this.kakaoId = kakaoId;
    this.profile = profile;
  }
}
