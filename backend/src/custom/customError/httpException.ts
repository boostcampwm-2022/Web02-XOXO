import { HttpException, HttpStatus } from '@nestjs/common';

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
