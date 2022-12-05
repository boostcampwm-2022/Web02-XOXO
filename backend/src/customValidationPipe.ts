import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  DuplicateJoinException,
  DuplicateNicknameException,
  InvalidFeedNameException,
  InvalidNicknameException,
  NonExistUserIdException,
} from './custom/customError/httpException';

export default class CustomValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      validationErrors.forEach((validationError) => {
        const errorType = Object.keys(validationError.constraints)[0];
        switch (errorType) {
          case 'InvalideNickname':
            throw new InvalidNicknameException();
          case 'DuplicateNickname':
            throw new DuplicateNicknameException();
          case 'InvalidFeedName':
            throw new InvalidFeedNameException();
          case 'NonExistUserId':
            throw new NonExistUserIdException();
          case 'DuplicatKakaoId':
            throw new DuplicateJoinException();
          default:
            throw new UnprocessableEntityException(validationError.constraints);
        }
      });
    };
  }
}
