import { PickType } from '@nestjs/swagger';
import Users from '../../entities/Users';

export default class JoinRequestDto extends PickType(Users, [
  'profile',
  'nickname',
] as const) {}
