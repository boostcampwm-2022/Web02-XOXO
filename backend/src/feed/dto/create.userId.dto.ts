import { IsExistUserId } from 'src/customValidators/userIdValidate';

export default class userIdDto {
  @IsExistUserId()
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  getUserID(): number {
    return this.userId;
  }
}
