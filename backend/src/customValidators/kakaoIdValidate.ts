import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import UsersService from 'src/users/users.service';

@ValidatorConstraint({ name: 'DuplicatKakaoId', async: true })
@Injectable()
export class DuplicatNickname implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(nickname: string, args: ValidationArguments) {
    const user = await this.userService.getUser({ nickname });
    if (user) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'DuplicateNickname';
  }
}

@ValidatorConstraint({ name: 'InvalideNickname', async: true })
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
