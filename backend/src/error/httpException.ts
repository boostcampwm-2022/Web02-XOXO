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

export class InvalidLoginDtoException extends HttpException {
  constructor(invalidRow: string) {
    super(
      {
        error: 'InvalidLoginDto',
        message: `${invalidRow}가 필요합니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class DuplicateNicknameException extends HttpException {
  constructor() {
    super(
      {
        error: 'DuplicateNickname',
        message: '이미 존재하는 닉네임 입니다.',
      },
      HttpStatus.CONFLICT,
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

export class InternalDBException extends HttpException {
  constructor() {
    super(
      {
        error: 'InternalDBException',
        message: '서버에 오류가 발생하였습니다.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
