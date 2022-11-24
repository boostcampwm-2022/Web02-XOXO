import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserInterface } from './entityInterfaces/UserInterface';
import { FeedInterface } from './entityInterfaces/FeedInterface';

@Entity({ schema: 'xoxo', name: 'user_feed_mapping' })
export default class UserFeedMapping {
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @PrimaryColumn({ type: 'int' })
  feedId: number;

  @ManyToOne('User', 'feeds')
  user: UserInterface;

  @ManyToOne('Feed')
  feed: FeedInterface;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
