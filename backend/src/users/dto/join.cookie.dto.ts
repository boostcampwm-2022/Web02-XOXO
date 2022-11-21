import { IsNotEmpty, IsUrl } from 'class-validator';

export default class JoinCookieDto {
  @IsNotEmpty()
  //unique 확인
  kakaoId: number;

  @IsNotEmpty()
  @IsUrl()
  profilePicture: string;
}
