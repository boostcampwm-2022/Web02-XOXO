import { PickType } from '@nestjs/swagger';
import Posting from '@root/entities/Posting.entity';
import { IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePostingDto extends PickType(Posting, [
  'letter',
  'thumbnail',
  'senderId',
] as const) {
  encryptedFeedId: string;
}

export class CreatePostingReqDto extends PickType(Posting, [
  'letter',
  'thumbnail',
] as const) {
  @IsNotEmpty()
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];
}
