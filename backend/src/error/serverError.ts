export class DBError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'DBError';
  }
}

export class NonExistUserError extends Error {
  constructor() {
    super('존재하지 않는 유저입니다.'); // (1)
    this.name = 'NonExistUserError';
  }
}

export class GroupFeedMemberListCountException extends Error {
  constructor() {
    super('그룹 피드 멤버는 2명 이상 100명 이하입니다'); // (1)
    this.name = 'GroupFeedMemberListCountException';
  }
}

export class NonExistFeedError extends Error {
  constructor() {
    super('존재하지 않는 피드입니다.'); // (1)
    this.name = 'NonExistUserError';
  }
}

export class DuplicateNicknameError extends Error {
  constructor() {
    super('중복된 닉네임 입니다.'); // (1)
    this.name = 'DuplicateNicknameError';
  }
}
export class DuplicateKakaoIdError extends Error {
  constructor() {
    super('중복된 카카오 id  입니다.'); // (1)
    this.name = 'DuplicateKakaoIdError';
  }
}

export class InvalidFKConstraintError extends Error {
  constructor() {
    super('유요하지 않은 참조입니다.'); // (1)
    this.name = 'InvalidFKConstraintError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('권한이 인증되지 않았습니다.'); // (1)
    this.name = 'UnauthorizedError';
  }
}
