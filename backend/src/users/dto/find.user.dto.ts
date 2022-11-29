import { PartialType } from '@nestjs/swagger';
import User from '../../entities/User.entity';

export default class FindUserDto extends PartialType(User) {}
