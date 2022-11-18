// eslint-disable-next-line max-classes-per-file
import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedToRedirectKakao extends HttpException {
  constructor() {
    super(
      {
        error: 'FailedToRedirectKakao',
        message: '카카오톡 로그인 리다이렉트에 실패하였습니다.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidLoginDto extends HttpException {
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
