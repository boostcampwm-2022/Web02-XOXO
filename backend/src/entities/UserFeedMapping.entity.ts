import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FeedInterface } from '@root/entities/entityInterfaces/FeedInterface';
import { UserInterface } from '@root/entities/entityInterfaces/UserInterface';

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
