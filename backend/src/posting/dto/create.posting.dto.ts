import { PickType } from '@nestjs/swagger';
import Posting from '@root/entities/Posting.entity';
import User from '@root/entities/User.entity';
import { decrypt } from '@root/feed/feed.utils';
import { IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePostingReqDto extends PickType(Posting, [
  'letter',
  'thumbnail',
] as const) {
  @IsNotEmpty()
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];
}

export class CreatePostingDto extends PickType(Posting, [
  'letter',
  'thumbnail',
  'senderId',
] as const) {
  feedId: number;

  constructor(
    user: User,
    encryptedFeedId: string,
    createPostingReq: CreatePostingReqDto,
  ) {
    super();
    this.letter = createPostingReq.letter;
    this.thumbnail = createPostingReq.thumbnail;
    this.senderId = user.id;
    this.feedId = Number(decrypt(encryptedFeedId));
  }
}

export class CreatePostingDecoratorDto {
  createPostingDto: {
    letter: string;
    thumbnail: string;
    senderId: number;
    feedId: number;
  };

  @IsNotEmpty()
  @IsArray()
  @IsUrl({}, { each: true })
  imageList: string[];
}
