import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IUser } from './entityInterfaces/UserInterface';
import { Ifeed } from './Feed.entity';

@Entity({ schema: 'xoxo', name: 'user_feed_mapping' })
export default class UserFeedMapping {
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @PrimaryColumn({ type: 'int' })
  feedId: number;

  @ManyToOne('User', 'feeds')
  user: IUser;

  @ManyToOne('Feed')
  feed: Ifeed;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
