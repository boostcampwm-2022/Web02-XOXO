import { PartialType } from '@nestjs/swagger';
import { Feed } from '@root/entities/Feed.entity';

export default class FindFeedDto extends PartialType(Feed) {
  encryptedId: string;
}
