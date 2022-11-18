import {
  IsDuplicateNickname,
  IsValidNickname,
} from 'src/customValidator/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname()
  @IsDuplicateNickname()
  nickname: string;
}
