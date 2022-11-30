import IsValidNickname from '../../custom/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname({ groups: ['customNickname'] })
  nickname: string;
}
