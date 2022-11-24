import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import UsersService from 'src/users/users.service';

@ValidatorConstraint({ name: 'DuplicateKakaoId', async: true })
@Injectable()
export class DuplicateKakaoId implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(kakaoId: number, args: ValidationArguments) {
    const user = await this.userService.getUser({ kakaoId });
    if (user) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'DuplicateKakaoId';
  }
}

export default function IsDuplicateKakaoId(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDuplicateNickname',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: DuplicateKakaoId,
    });
  };
}
