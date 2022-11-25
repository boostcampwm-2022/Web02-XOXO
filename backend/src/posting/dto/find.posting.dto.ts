import { PartialType } from '@nestjs/swagger';
import Posting from 'src/entities/Posting.entity';

export default class FindPostingDto extends PartialType(Posting) {}
