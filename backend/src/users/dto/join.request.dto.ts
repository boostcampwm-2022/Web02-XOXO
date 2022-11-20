import { PickType } from '@nestjs/swagger';
import Users from '../../entities/User.entity';

export default class JoinRequestDto extends PickType(Users, [
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
