import { IsNotEmpty, IsUrl } from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { FeedInterface } from './entityInterfaces/FeedInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';
import UserFeedMapping from './UserFeedMapping.entity';

@Entity({ schema: 'xoxo', name: 'feeds' })
export class Feed implements FeedInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 15 })
  name: string;

  @IsUrl()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  thumbnail: string;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  description: string;

  @IsNotEmpty()
  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column('int', { default: 0 })
  memberCount: number;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany('Posting', 'feed')
  postings: PostingInterface[];

  @OneToMany(
    (type) => UserFeedMapping,
    (userFeedMapping) => userFeedMapping.feed,
  )
  users: UserFeedMapping[];
}
