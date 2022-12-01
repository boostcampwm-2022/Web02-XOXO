import { PartialType } from '@nestjs/swagger';
import User from '@root/entities/User.entity';

export default class FindUserDto extends PartialType(User) {}
