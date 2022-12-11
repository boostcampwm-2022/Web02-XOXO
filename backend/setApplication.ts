import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '@root/common/filters/http.exception.filter';
import { ServerErrorExceptionFilter } from '@root/common/filters/server.error.exception.filter';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';

export const setApplication = (app: INestApplication) => {
  app.use(cookieParser());
  app.useGlobalFilters(
    new ServerErrorExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(new CustomValidationPipe());
};

export default setApplication;
