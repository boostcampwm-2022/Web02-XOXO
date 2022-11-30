import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { ServerErrorHandlingFilter } from 'src/ServerErrorHandlingFilter';
import ValidationPipe422 from 'src/validation';

export const setApplication = (app: INestApplication) => {
  app.use(cookieParser());
  app.useGlobalFilters(
    new ServerErrorHandlingFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe422());
};

export default setApplication;
