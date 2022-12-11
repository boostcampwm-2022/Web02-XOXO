import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  InvalidFeedNameException,
  InvalidNicknameException,
} from '../../custom/customError/httpException';

export default class CustomValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      validationErrors.forEach((validationError) => {
        const errorType = Object.keys(validationError.constraints)[0];
        switch (errorType) {
          case 'InvalideNickname':
            throw new InvalidNicknameException();
          case 'InvalidFeedName':
            throw new InvalidFeedNameException();
          default:
            throw new UnprocessableEntityException(validationError.constraints);
        }
      });
    };
  }
}
