import { IsNotEmpty, IsUrl } from 'class-validator';

export default class JoinCookieDto {
  @IsNotEmpty()
  kakaoId: number;

  @IsNotEmpty()
  @IsUrl()
  profilePicture: string;
}
