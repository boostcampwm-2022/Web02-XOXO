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

export class DuplicateJoinException extends HttpException {
  constructor() {
    super(
      {
        error: 'DuplicateUser',
        message: '이미 존재하는 회원입니다.',
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

export class InternalServerException extends HttpException {
  constructor() {
    super(
      {
        error: 'InternalServerException',
        message: '서버에 오류가 발생하였습니다.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
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

export class InvalidPostingDtoException extends HttpException {
  constructor(emptyValue: string) {
    super(
      {
        error: 'InvalidPostingDtoException',
        message: `${emptyValue}는 필수값입니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class NonExistUserIdException extends HttpException {
  constructor() {
    super(
      {
        error: 'NonExistUserException',
        message: `존재하지 않는 user_id 입니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class NonExistFeedIdException extends HttpException {
  constructor() {
    super(
      {
        error: 'NonExistFeedIdException',
        message: `존재하지 않는 피드 입니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class NoFeedIdException extends HttpException {
  constructor() {
    super(
      {
        error: 'NonExistFeedIdException',
        message: `feedId가 없습니다.`,
      },
      404,
    );
  }
}

export class GroupFeedMemberListCountException extends HttpException {
  constructor() {
    super(
      {
        error: 'GroupFeedMemberListCountException',
        message: `그룹 피드 멤버는 2명 이상 100명 이하입니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class InvalidFKConstraintException extends HttpException {
  constructor() {
    super(
      {
        error: 'InvalidFKConstraintException',
        message: `입력값 중 유효하지 않은 참조값이 있습니다.`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class AccessBeforeDueDateException extends HttpException {
  constructor() {
    super(
      {
        error: 'AccessBeforeDueDateException',
        message: `피드 공개일 이전에는 포스팅에 접근할 수 없습니다.`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidPostingId extends HttpException {
  constructor() {
    super(
      {
        error: 'InvalidPostingId',
        message: `존재하지 않는 포스팅 입니다.`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super(
      {
        error: 'InvalidToken',
        message: `유효하지 않은 토큰입니다.`,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ExpiredTokenException extends HttpException {
  constructor() {
    super(
      {
        error: 'ExpiredTokenException',
        message: `토큰이 만료되었습니다.`,
      },
      410,
    );
  }
}

export class NoExistTokenException extends HttpException {
  constructor() {
    super(
      {
        error: 'NoExistTokenException',
        message: `Token이 없습니다.`,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        error: 'UnauthorizedException',
        message: `권한이 인증되지 않았습니다.`,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
