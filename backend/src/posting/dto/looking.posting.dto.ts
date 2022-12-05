import { PickType } from '@nestjs/swagger';
import Posting from '@root/entities/Posting.entity';
import { IsArray, IsUrl } from 'class-validator';

export default class LookingPostingDto extends PickType(Posting, [
  'letter',
  'thumbnail',
] as const) {
  @IsArray()
  @IsUrl({}, { each: true })
  private imageList: string[];

  private sender: { nickname: string; thumbnail: string };

  constructor(posting: Posting) {
    super();
    this.letter = posting.letter;
    this.thumbnail = posting.thumbnail;
    this.getImgList(posting.images);
    this.getSender(posting.sender);
  }

  getImgList(postingImages) {
    this.imageList = postingImages.map((obj) => obj.url);
  }

  getSender(postingSender) {
    this.sender = {
      nickname: postingSender.nickname,
      thumbnail: postingSender.thumbnail,
    };
  }

  static createLookingPostingDto(posting) {
    if (!posting) return null;
    return new LookingPostingDto(posting);
  }
}
