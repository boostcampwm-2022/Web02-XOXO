import { PickType } from '@nestjs/swagger';
import { Feed } from '@root/entities/Feed.entity';
import { FeedService } from '@root/feed/feed.service';
import { encrypt } from '@root/feed/feed.utils';

export default class FeedResponseDto extends PickType(Feed, [
  'name',
  'thumbnail',
] as const) {
  encryptedId: string;

  constructor(feed: Feed) {
    super();
    this.name = feed.name;
    this.thumbnail = feed.thumbnail;
    this.encryptedId = encrypt(feed.id.toString());
  }

  static makeFeedResponseDto(feed: Feed) {
    return new FeedResponseDto(feed);
  }

  static makeFeedResponseArray(feeds: Feed[]) {
    const feedResponseArray = feeds.map((feed) => new FeedResponseDto(feed));
    return feedResponseArray;
  }
}
