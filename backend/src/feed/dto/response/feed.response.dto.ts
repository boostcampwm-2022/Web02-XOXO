import { PickType } from '@nestjs/swagger';
import { Feed } from '@root/entities/Feed.entity';
import { encrypt } from '@root/feed/feed.utils';

export default class FeedResponseDto extends PickType(Feed, [
  'name',
  'thumbnail',
  'isGroupFeed',
] as const) {
  encryptedId: string;

  constructor(feed: Feed, isGroupFeed: boolean) {
    super();
    this.name = feed.name;
    this.thumbnail = feed.thumbnail;
    this.encryptedId = encrypt(feed.id.toString());
    this.isGroupFeed = isGroupFeed;
  }

  static makeFeedResponseDto(feed: Feed, isGroupFeed: boolean) {
    return new FeedResponseDto(feed, isGroupFeed);
  }

  static makeFeedResponseArray(feeds: Feed[], isGroupFeed: boolean) {
    const feedResponseArray = feeds.map(
      (feed) => new FeedResponseDto(feed, isGroupFeed),
    );
    return feedResponseArray;
  }
}
