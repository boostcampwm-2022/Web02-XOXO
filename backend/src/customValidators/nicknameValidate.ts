import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'InvalidNickname' })
@Injectable()
export class InvalidNickname implements ValidatorConstraintInterface {
  async validate(nickname: string, args: ValidationArguments) {
    if (!nickname) return false;
    return nickname.length < 10;
  }

  defaultMessage(args: ValidationArguments) {
    return 'InvalidNickname';
  }
}

export default function IsValidNickname(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidNickname',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: InvalidNickname,
    });
  };
}
