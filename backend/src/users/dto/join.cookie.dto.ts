import { IsNotEmpty, IsUrl } from 'class-validator';
import { IsDuplicateKakaoId } from 'src/customValidators/kakaoIdValidate';

export default class JoinCookieDto {
  @IsNotEmpty()
  kakaoId: number;

  @IsNotEmpty()
  @IsUrl()
  profilePicture: string;
}
