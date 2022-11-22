import {
  ArgumentMetadata,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  DuplicateNicknameException,
  InvalidFeedNameException,
  InvalidNicknameException,
  NonExistUserIdException,
} from './error/httpException';

//to-do: 하드코딩 제거
export default class ValidationPipe422 extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      console.log(e);
      const res = e.response;
      if (res.message.includes('InvalidNickname')) {
        throw new InvalidNicknameException();
      }
      if (res.message.includes('DuplicateNickname')) {
        throw new DuplicateNicknameException();
      }
      if (res.message.includes(`InvalidFeedName`)) {
        throw new InvalidFeedNameException();
      }
      if (res.message.includes(`NonExistUserId`)) {
        throw new NonExistUserIdException();
      }
      throw new UnprocessableEntityException();
    }
  }
}
