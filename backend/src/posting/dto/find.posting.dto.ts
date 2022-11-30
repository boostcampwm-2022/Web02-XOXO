import { PartialType } from '@nestjs/swagger';
import Posting from '@root/entities/Posting.entity';

export default class FindPostingDto extends PartialType(Posting) {}
