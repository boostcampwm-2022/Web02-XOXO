import IsValidNickname from '@root/custom/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname()
  nickname: string;
}
