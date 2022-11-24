import { Injectable } from '@nestjs/common';
import { OauthService } from 'src/oauth/oauth.service';
import { forwardRef, Inject } from '@nestjs/common';
import UsersService from './users.service';
import JoinRequestDto from './dto/join.request.dto';
import JoinNicknameDto from './dto/join.nickname.dto';
import JoinCookieDto from './dto/join.cookie.dto';

interface JoinUserInterface {
  joinNicknameDto: JoinNicknameDto;
  joinCookieDto: JoinCookieDto;
}

@Injectable()
export default class UserFacade {
  constructor(
    @Inject(forwardRef(() => UsersService)) // 여기 순환참조...
    private readonly userService: UsersService,
    private readonly oauthService: OauthService,
  ) {}

  async getUserInfoFromKakao(code: string) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUser({ kakaoId });
    return { user, profilePicture, kakaoId };
  }

  async createUser({ joinNicknameDto, joinCookieDto }: JoinUserInterface) {
    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      joinCookieDto.kakaoId,
      joinCookieDto.profilePicture,
    );

    const userId = await this.userService.joinUser(joinMember);
    return userId;
  }
}
