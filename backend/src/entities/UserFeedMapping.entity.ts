import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Feed } from './Feed.entity';
import User from './User.entity';

@Entity({ schema: 'xoxo', name: 'user_feed_mapping' })
export default class UserFeedMapping {
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @PrimaryColumn({ type: 'int' })
  feedId: number;

  @ManyToOne((type) => User, (user) => user.feeds)
  user: User;

  @ManyToOne((type) => Feed)
  feed: Feed;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
