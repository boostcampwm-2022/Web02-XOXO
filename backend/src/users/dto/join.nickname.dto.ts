import IsValidNickname from 'src/custom/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname({ groups: ['customNickname'] })
  nickname: string;
}
