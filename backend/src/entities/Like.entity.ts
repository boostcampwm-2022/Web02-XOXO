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
import Posting from './Posting.entity';
import User from './User.entity';

@Entity({ schema: 'xoxo', name: 'heart' })
export default class Like {
  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne((type) => User, (user) => user.feeds)
  user: User;

  @PrimaryColumn({ type: 'int', name: 'postingId' })
  @ManyToOne((type) => Feed)
  posting: Posting;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
