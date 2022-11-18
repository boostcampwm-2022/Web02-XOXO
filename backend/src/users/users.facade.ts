import { OauthService } from 'src/oauth/oauth.service';
import { InvalidLoginDtoException } from 'src/error/httpException';
import { forwardRef, Inject } from '@nestjs/common';
import UsersService from './users.service';
import JoinRequestDto from './dto/join.request.dto';
import JoinNicknameDto from './dto/join.nickname.dto';

interface JoinUserInterface {
  joinNicknameDto: JoinNicknameDto;
  kakaoId: string | undefined;
  profilePicture: string | undefined;
}

export default class UserFacade {
  constructor(
    @Inject(forwardRef(() => UsersService)) // 여기 순환참조...
    private readonly userService: UsersService,
    private readonly oauthService: OauthService,
  ) {}

  async getUserInfoFromKakao(code: string) {
    const openID = await this.oauthService.getAccessToken(code);
    const { kakaoId, profilePicture } = this.oauthService.validateToken(openID);
    const user = await this.userService.getUserByKakaoId(kakaoId);
    return { user, profilePicture, kakaoId };
  }

  async createUser({
    joinNicknameDto,
    kakaoId,
    profilePicture,
  }: JoinUserInterface) {
    if (!kakaoId) throw new InvalidLoginDtoException('kakaoId');
    if (!profilePicture) throw new InvalidLoginDtoException('profilePicture');

    const joinMember = new JoinRequestDto(
      joinNicknameDto.nickname,
      kakaoId,
      profilePicture,
    );
    const userId = await this.userService.joinUser(joinMember);
    return userId;
  }
}