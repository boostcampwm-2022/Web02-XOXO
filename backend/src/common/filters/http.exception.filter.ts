import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const data = exception.getResponse() as { message: string };

    res.status(statusCode).json({
      success: false,
      code: statusCode,
      data,
    });
  }
}
