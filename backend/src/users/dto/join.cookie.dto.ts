import { IsNotEmpty, IsNumberString, IsUrl } from 'class-validator';

export default class JoinCookieDto {
  @IsNotEmpty()
  @IsNumberString()
  kakaoId: number;

  @IsNotEmpty()
  @IsUrl()
  profilePicture: string;
}
