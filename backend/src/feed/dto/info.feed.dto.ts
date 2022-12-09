import { PickType } from '@nestjs/swagger';
import { NonExistFeedError } from '@root/custom/customError/serverError';
import { Feed } from '@root/entities/Feed.entity';

export default class FeedInfoDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'description',
  'dueDate',
  'isGroupFeed',
] as const) {
  postingCnt: number;

  isOwner: boolean;

  constructor(feed: Feed, userId: number) {
    super();
    this.name = feed.name;
    this.thumbnail = feed.thumbnail;
    this.description = feed.description;
    this.dueDate = feed.dueDate;
    this.getPostingCnt(feed.postings);
    this.checkIsOwner(feed.users, userId);
  }

  getPostingCnt(postingArray: { id: number }[]) {
    this.postingCnt = postingArray.length;
  }

  checkIsOwner(users: { userId: number }[], userID: number) {
    const userIdList = users.map((obj) => obj.userId);
    const isOwner = userIdList.includes(userID);
    this.isOwner = isOwner;
  }

  static createFeedInfoDto(feed, userId: number) {
    if (!feed) throw new NonExistFeedError();
    return new FeedInfoDto(feed, userId);
  }
}
