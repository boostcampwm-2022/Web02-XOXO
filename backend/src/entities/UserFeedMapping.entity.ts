import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Feed } from './Feed.entity';
import User from './User.entity';

@Entity({ schema: 'xoxo', name: 'user_feed_mapping' })
export default class UserFeedMapping {
  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne((type) => User, (user) => user.feeds)
  user: User;

  @PrimaryColumn({ type: 'int', name: 'feedId' })
  @ManyToOne((type) => Feed)
  feed: Feed;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
