import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import PostFormDto from './dto/oauth.postform.dto';
import { makeFormData, parseToken } from './oauth.utils';

@Injectable()
export class OauthService {
  constructor(private readonly httpService: HttpService) {}

  // eslint-disable-next-line class-methods-use-this
  validateToken(openId: string) {
    const { header, payload, signature } = parseToken(openId);
    //
    if (
      payload.iss !== 'https://kauth.kakao.com' ||
      payload.aud !== process.env.KAKAO_CLIENT_ID ||
      payload.exp < new Date().getTime() / 1000
    )
      throw new ForbiddenException('openID가 유효하지 않습니다.');

    // to-do : 서명 알고리즘 추가
    return { kakaoId: payload.sub, profilePicture: payload.picture };
  }

  async getAccessToken(code: string): Promise<any> {
    const accessTokenConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      withCredentials: true,
    };

    const openId = await lastValueFrom(
      this.httpService
        .post(
          `https://kauth.kakao.com/oauth/token`,
          makeFormData(
            new PostFormDto(
              process.env.KAKAO_CLIENT_ID,
              process.env.KAKAO_REDIRECT_URL,
              code,
            ),
          ),
          accessTokenConfig,
        )
        .pipe(
          map((res) => {
            return res.data.id_token;
          }),
        ),
    );
    if (!openId) throw new ForbiddenException('openID가 유효하지 않습니다.');

    return openId;
  }
}
