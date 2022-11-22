import { PartialType } from '@nestjs/swagger';
import User from 'src/entities/User.entity';
import { runInThisContext } from 'vm';

export class FindUserDto extends PartialType(User) {}
