import { forwardRef, Inject, Injectable } from '@nestjs/common';
import JoinNicknameDto from '@users/dto/join.nickname.dto';
import JoinCookieDto from '@users/dto/join.cookie.dto';
import UsersService from '@users/users.service';
import { AuthenticationService } from '@root/authentication/authentication.service';
import { encrypt } from '@root/feed/feed.utils';
import { createHash } from 'crypto';
import { OauthService } from '../oauth/oauth.service';
import JoinRequestDto from './dto/join.request.dto';
import CookieDto from './dto/cookie.info.dto';

@Injectable()
export default class UserFacade {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly oauthService: OauthService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async getUserInfoFromKakao(code: string) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUser({ kakaoId });
    return { user, profilePicture, kakaoId };
  }

  async publishToken(userId: number, nickname: string) {
    const { accessToken, ...accessTokenOption } =
      this.authenticationService.getCookieWithJwtAccessToken(nickname, userId);

    const { refreshToken, ...refreshTokenOption } =
      this.authenticationService.getCookieWithJwtRefreshToken(nickname, userId);

    await this.userService.setCurrentRefreshToken(refreshToken, userId);

    return {
      refreshTokenCookie: new CookieDto(
        'refreshToken',
        refreshToken,
        refreshTokenOption,
      ),
      accessTokenCookie: new CookieDto(
        'accessToken',
        accessToken,
        accessTokenOption,
      ),
    };
  }

  async login(code: string) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUser({ kakaoId });

    if (!user) {
      const cookieOption = { httpOnly: true, maxAge: 60 * 60 * 1000 };

      const kakaoCookie = new CookieDto('kakaoId', kakaoId, cookieOption);
      const profilePictureCookie = new CookieDto(
        'profilePicture',
        profilePicture,
        cookieOption,
      );

      return {
        cookieList: [kakaoCookie, profilePictureCookie],
        redirectURL: `${process.env.CLIENT_URL_PREFIX}/signin/info`,
      };
    }

    const { refreshTokenCookie, accessTokenCookie } = await this.publishToken(
      user.id,
      user.nickname,
    );

    const redirectURL = user.lastVistedFeed
      ? `${process.env.CLIENT_URL_PREFIX}/feed/${encrypt(
          user.lastVistedFeed.toString(),
        )}`
      : `${process.env.CLIENT_URL_PREFIX}/feeds`;

    return {
      cookieList: [accessTokenCookie, refreshTokenCookie],
      redirectURL,
    };
  }

  async joinUser(
    joinCookieDto: JoinCookieDto,
    joinNicknameDto: JoinNicknameDto,
  ) {
    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      joinCookieDto.kakaoId,
      joinCookieDto.profilePicture,
    );
    const userId = await this.userService.joinUser(joinMember);

    const { refreshTokenCookie, accessTokenCookie } = await this.publishToken(
      userId,
      joinMember.nickname,
    );

    return [accessTokenCookie, refreshTokenCookie];
  }

//   async checkIsDuplicateNickname(nickname: string) {
//     const res = await this.userService.getUser({
//       hashedNickname: createHash('md5').update(nickname).digest('hex'),
//     });

//     return !!res;
//   }
  
  async checkIsDuplicateNickname(nickname: string) {
    const res = await this.userService.getUser({
      nickname,
      // hashedNickname: createHash('md5').update(nickname).digest('hex'),
    });

    return !!res;
  }

}
