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

export class DuplicateNicknameError extends Error {
  constructor() {
    super('중복된 닉네임 입니다.'); // (1)
    this.name = 'DuplicateNicknameError';
  }
}

export class InvalidFKConstraintError extends Error {
  constructor() {
    super('유요하지 않은 참조입니다.'); // (1)
    this.name = 'InvalidFKConstraintError';
  }
}
