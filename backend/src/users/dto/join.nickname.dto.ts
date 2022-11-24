import {
  IsDuplicateNickname,
  IsValidNickname,
} from 'src/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname({ groups: ['customNickname'] })
  @IsDuplicateNickname()
  nickname: string;
}
