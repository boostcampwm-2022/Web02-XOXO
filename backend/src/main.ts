import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import TransformInterceptor from '@root/common/interceptors/transform.interceptor';
import AppModule from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import CustomValidationPipe from './customValidationPipe';
import { ServerErrorHandlingFilter } from './ServerErrorHandlingFilter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(
    new ServerErrorHandlingFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('XOXO API')
    .setDescription('The XOXO API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
  console.log(`Running on ${process.env.PORT}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
