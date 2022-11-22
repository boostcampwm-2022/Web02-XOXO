export default class DBError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'DBError';
  }
}
