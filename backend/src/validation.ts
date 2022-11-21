import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import {
  DuplicateNicknameException,
  InvalidNicknameException,
} from './error/httpException';

export default class ValidationPipe422 extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      const res = e.response;
      if (res.message.includes('InvalidNickname')) {
        throw new InvalidNicknameException();
      }
      if (res.message.includes('DuplicateNickname')) {
        throw new DuplicateNicknameException();
      }
    }
  }
}
