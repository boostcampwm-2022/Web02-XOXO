import { PickType } from '@nestjs/swagger';
import { Feed } from '@root/entities/Feed.entity';

export default class FeedInfoDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'description',
  'dueDate',
] as const) {
  postingCnt: number;

  constructor(feed: Feed) {
    super();
    this.name = feed.name;
    this.thumbnail = feed.thumbnail;
    this.description = feed.description;
    this.dueDate = feed.dueDate;
    this.getPostingCnt(feed.postings);
  }

  getPostingCnt(postingArray: { id: number }[]) {
    this.postingCnt = postingArray.length;
  }
}
