import {
  IsDuplicateNickname,
  IsValidNickname,
} from 'src/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname()
  @IsDuplicateNickname()
  nickname: string;
}
