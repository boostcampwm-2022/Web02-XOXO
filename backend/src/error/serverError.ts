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
