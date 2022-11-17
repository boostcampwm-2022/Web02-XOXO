import { OauthService } from 'src/oauth/oauth.service';
import UsersService from './users.service';

export default class UserFacade {
  constructor(
    private readonly userService: UsersService,
    private readonly oauthService: OauthService,
  ) {}

  async getUserInfoFromKakao(code: string) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUserByKakaoId(kakaoId);
    return { user, profilePicture, kakaoId };
  }
}
