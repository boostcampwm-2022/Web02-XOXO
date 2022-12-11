import { PickType } from '@nestjs/swagger';
import IsValidFeedName from '@root/custom/customValidators/feedValidate';
import { Feed } from '@root/entities/Feed.entity';

export default class CreateFeedDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'description',
  'dueDate',
] as const) {
  @IsValidFeedName()
  name: string;
}
