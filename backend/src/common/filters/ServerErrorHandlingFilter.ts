import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  DuplicateJoinException,
  DuplicateNicknameException,
  GroupFeedMemberListCountException,
  InternalDBException,
  InvalidFKConstraintException,
  NonExistFeedIdException,
  NonExistFKException,
  NonExistPostingIdException,
  NonExistUserIdException,
  UnauthorizedException,
} from '@root/custom/customError/httpException';

@Catch()
export class ServerErrorHandlingFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    console.log(error);
    let exception: HttpException;
    const errorName = error.name;
    const errorMessage = error.message;
    console.log(errorName, 'filter');
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

      case 'NonExistPostingError':
        exception = new NonExistPostingIdException();
        break;

      case 'GroupFeedMemberListCountException':
        exception = new GroupFeedMemberListCountException();
        break;

      case 'DuplicateKakaoIdError':
        exception = new DuplicateJoinException();
        break;

      case 'UnauthorizedError':
        exception = new UnauthorizedException();
        break;

      case 'NonExistFKConstraintError':
        exception = new NonExistFKException(errorMessage);
        break;

      default:
        if (error.message.includes('digital envelope routines'))
          exception = new NonExistFeedIdException();
        else exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    res.status((exception as HttpException).getStatus()).json({
      success: false,
      code: exception.getStatus(),
      data: response,
    });
  }
}
