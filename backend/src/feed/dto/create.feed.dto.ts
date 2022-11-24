import { PickType } from '@nestjs/swagger';
import { Feed } from 'src/entities/Feed.entity';

// dto
export default class CreateFeedDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'description',
  'dueDate',
] as const) {}
