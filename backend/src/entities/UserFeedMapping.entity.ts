import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FeedInterface } from './entityInterfaces/FeedInterface';
import { UserInterface } from './entityInterfaces/UserInterface';

@Entity({ schema: process.env.DB_DATABASE, name: 'user_feed_mapping' })
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
