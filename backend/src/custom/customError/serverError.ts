import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
  private readonly statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;
  }

  getMessage() {
    return this.message;
  }

  getStatudCode() {
    return this.statusCode;
  }
}

// Invalid Input
export class NonExistFeedError extends CustomError {
  constructor() {
    super('존재하지 않는 피드입니다.', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

// Validation Error
export class GroupFeedMembersCountError extends CustomError {
  constructor() {
    super(
      `그룹 피드 멤버는 2명 이상 100명 이하입니다.`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class DuplicateNicknameError extends CustomError {
  constructor() {
    super('중복된 닉네임 입니다.', HttpStatus.CONFLICT);
  }
}

export class DuplicateKakaoIdError extends CustomError {
  constructor() {
    super('이미 존재하는 회원입니다.', HttpStatus.CONFLICT);
  }
}

// Duedate
export class AccessBeforeDueDateError extends CustomError {
  constructor() {
    super(
      `피드 공개일 이전에는 포스팅에 접근할 수 없습니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccessAfterDueDateError extends CustomError {
  constructor() {
    super(
      `피드 공개일 후에는 포스팅을 작성할 수 없습니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}

// Authorization
export class InvalidTokenError extends CustomError {
  constructor() {
    super(`유효하지 않은 토큰입니다.`, HttpStatus.UNAUTHORIZED);
  }
}

export class ExpiredTokenError extends CustomError {
  constructor() {
    super(`토큰이 만료되었습니다.`, HttpStatus.GONE);
  }
}

export class UnauthorizedError extends CustomError {
  constructor() {
    super('권한이 인증되지 않았습니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class NonExistTokenError extends CustomError {
  constructor() {
    super('Token이 없습니다.', HttpStatus.UNAUTHORIZED);
  }
}
