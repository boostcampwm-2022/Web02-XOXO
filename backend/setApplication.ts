import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '@root/common/filters/http-exception.filter';
import { ServerErrorHandlingFilter } from '@root/common/filters/ServerErrorHandlingFilter';
import CustomValidationPipe from '@root/common/pipes/customValidationPipe';

export const setApplication = (app: INestApplication) => {
  app.use(cookieParser());
  app.useGlobalFilters(
    new ServerErrorHandlingFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(new CustomValidationPipe());
};

export default setApplication;
