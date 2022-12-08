import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import {
  CustomError,
  NotInLoaginStateError,
} from '@root/custom/customError/serverError';
import { QueryFailedError } from 'typeorm';
import { ResponseEntity } from '../response/response.entity';

@Catch()
export class ServerErrorHandlingFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    console.log(error);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let statusCode: HttpStatus;
    let message: string;

    if (error instanceof CustomError) {
      // 로그인 상태 분기 처리
      if (error instanceof NotInLoaginStateError) {
        res.status(statusCode).json({
          success: true,
          code: 200,
          data: false,
        });
        // res.send(ResponseEntity.OK_WITH_DATA(false));
        return;
      }

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
