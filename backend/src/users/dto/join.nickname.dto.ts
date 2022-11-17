import { IsNotEmpty, IsString } from 'class-validator';

export default class JoinNicknameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
