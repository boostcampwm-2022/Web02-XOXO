import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'InvalidFeedName', async: true })
@Injectable()
export class InvalidFeedName implements ValidatorConstraintInterface {
  async validate(feedName: string, args: ValidationArguments) {
    if (!feedName) return false;

    return feedName.length <= 15;
  }

  defaultMessage(args: ValidationArguments) {
    return 'InvalidFeedName';
  }
}

export default function IsValidFeedName(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsValidFeedName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: InvalidFeedName,
    });
  };
}
