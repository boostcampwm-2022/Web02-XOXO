import { PickType } from '@nestjs/swagger';
import { Feed } from 'src/entities/Feed.entity';

export default class CreateFeedDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'description',
  'dueDate',
] as const) {}
