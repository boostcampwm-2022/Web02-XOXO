import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DuplicateNicknameException,
  InternalDBException,
  InvalidFKConstraintException,
  NonExistUserIdException,
} from './error/httpException';
import {
  DBError,
  DuplicateNicknameError,
  InvalidFKConstraintError,
  NonExistUserError,
} from './error/serverError';

@Catch()
export class ServerErrorHandlingFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let exception: HttpException;
    const errorName = error.name;
    switch (errorName) {
      case 'DBError':
        exception = new InternalDBException();
        break;

      case 'NonExistUserError':
        exception = new NonExistUserIdException();
        break;

      case 'DuplicateNicknameError':
        exception = new DuplicateNicknameException();
        break;

      case 'InvalidFKConstraintError':
        exception = new InvalidFKConstraintException();
        break;

      default:
        exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    res.status((exception as HttpException).getStatus()).json(response);
  }
}
