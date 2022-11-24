import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DuplicateJoinException,
  DuplicateNicknameException,
  EmptyGroupFeedMemberList,
  InternalDBException,
  InvalidFKConstraintException,
  NonExistFeedIdException,
  NonExistUserIdException,
} from './error/httpException';

@Catch()
export class ServerErrorHandlingFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let exception: HttpException;
    const errorName = error.name;
    console.log(error);
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

      case 'NonExistFeedError':
        exception = new NonExistFeedIdException();
        break;

      case 'MemberListMustMoreThanOne':
        exception = new EmptyGroupFeedMemberList();
        break;

      case 'DuplicateKakaoIdError':
        exception = new DuplicateJoinException();
        break;

      default:
        if (error.message.includes('digital envelope routines'))
          exception = new NonExistFeedIdException();
        else exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    res.status((exception as HttpException).getStatus()).json(response);
  }
}
