import { PartialType } from '@nestjs/swagger';
import User from 'src/entities/User.entity';

export class FindUserDto extends PartialType(User) {}
