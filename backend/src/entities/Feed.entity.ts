import { IsNotEmpty, IsUrl } from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { FeedInterface } from '@root/entities/entityInterfaces/FeedInterface';
import { PostingInterface } from '@root/entities/entityInterfaces/PostingInterface';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';

@Entity({ schema: process.env.DB_DATABASE, name: 'feeds' })
export class Feed implements FeedInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 15, nullable: false })
  name: string;

  @IsUrl()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  thumbnail: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @IsNotEmpty()
  @Column({ type: 'datetime', nullable: false })
  dueDate: Date;

  @IsNotEmpty()
  @Column('bool', { nullable: false })
  isGroupFeed: boolean;

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
