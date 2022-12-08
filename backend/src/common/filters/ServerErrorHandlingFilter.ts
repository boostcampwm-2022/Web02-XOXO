import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import {
  CustomError,
  NonExistFeedError,
} from '@root/custom/customError/serverError';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ServerErrorHandlingFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

<<<<<<< HEAD
    console.log(error);
    let exception: HttpException;
    const errorName = error.name;
    const errorMessage = error.message;
    console.log(errorName, 'filter');
    switch (errorName) {
      case 'DBError':
        exception = new InternalDBException();
        break;
=======
    let statusCode: HttpStatus;
    let message: string;
>>>>>>> main

    if (error instanceof CustomError) {
      statusCode = error.getStatudCode();
      message = error.getMessage();
    } else if (error instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'BAD_REQUEST';
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '서버에서 에러가 발생했습니다. 관리자에게 문의하십시오.';
    }

    res.status(statusCode).json({
      success: false,
      code: statusCode,
      data: { message },
    });
  }
}
