import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import UsersService from 'src/users/users.service';

@ValidatorConstraint({ name: 'ExistUserId', async: true })
@Injectable()
export class ExistUserId implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(id: number, args: ValidationArguments) {
    const user = await this.userService.getUser({ id });
    if (!user) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'NonExistUserId';
  }
}

export function IsExistUserId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExistUserId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ExistUserId,
    });
  };
}
