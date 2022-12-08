import { PickType } from '@nestjs/swagger';
import { NonExistPostingError } from '@root/custom/customError/serverError';
import { FeedInterface } from '@root/entities/entityInterfaces/FeedInterface';
import { ImageInterface } from '@root/entities/entityInterfaces/ImageInterface';
import { UserInterface } from '@root/entities/entityInterfaces/UserInterface';
import Posting from '@root/entities/Posting.entity';
import { IsArray, IsUrl } from 'class-validator';

export default class LookingPostingDto extends PickType(Posting, [
  'letter',
  'thumbnail',
] as const) {
  @IsArray()
  @IsUrl({}, { each: true })
  private imageList: string[];

  private sender: UserInterface;

  private feed: FeedInterface;

  constructor(posting: Posting) {
    super();
    this.letter = posting.letter;
    this.thumbnail = posting.thumbnail;
    this.getImgList(posting.images);
    this.sender = posting.sender;
    this.feed = posting.feed;
  }

  getImgList(postingImages: ImageInterface[]) {
    this.imageList = postingImages.map((obj) => obj.url);
  }

  static createLookingPostingDto(posting) {
    if (!posting) throw new NonExistPostingError();
    return new LookingPostingDto(posting);
  }
}
