import {
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export default class ValidationPipe422 extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException('custom error');
      }
    }
  }
}
