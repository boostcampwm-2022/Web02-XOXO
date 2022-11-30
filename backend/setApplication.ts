import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '@root/http-exception.filter';
import { ServerErrorHandlingFilter } from '@root/ServerErrorHandlingFilter';
import CustomValidationPipe from '@root/customValidationPipe';

export const setApplication = (app: INestApplication) => {
  app.use(cookieParser());
  app.useGlobalFilters(
    new ServerErrorHandlingFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(new CustomValidationPipe());
};

export default setApplication;
