import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedToRedirectKakaoException extends HttpException {
  constructor() {
    super(
      {
        error: 'FailedToRedirectKakao',
        message: '카카오톡 인가코드 리다이렉트에 실패하였습니다.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class FailedToLoginKakaoException extends HttpException {
  constructor() {
    super(
      {
        error: 'FailedToLoginKakao',
        message: '카카오톡 로그인에 실패하였습니다.',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidNicknameException extends HttpException {
  constructor() {
    super(
      {
        error: 'InvalidNickname',
        message: '유효하지 않은 닉네임입니다.',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidFeedNameException extends HttpException {
  constructor() {
    super(
      {
        error: 'InvalidFeedName',
        message: '피드 제목은 15글자를 초과할 수 없습니다.',
      },
      HttpStatus.CONFLICT,
    );
  }
}
