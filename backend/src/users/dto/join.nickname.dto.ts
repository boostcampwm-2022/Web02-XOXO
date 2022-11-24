import IsValidNickname from 'src/customValidators/nicknameValidate';

export default class JoinNicknameDto {
  @IsValidNickname({ groups: ['customNickname'] })
  nickname: string;
}
