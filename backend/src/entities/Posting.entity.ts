import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Comment from './Comment.entity';
import { Feed } from './Feed.entity';
import Image from './Image.entity';
import User from './User.entity';

@Entity({ schema: 'xoxo', name: 'postings' })
export default class Posting {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar')
  letter: string;

  @IsNotEmpty()
  @IsUrl()
  thumbnail: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne((type) => User)
  sender: User;

  @ManyToOne((type) => Feed, (feed) => feed.postings)
  feed: Feed;

  @OneToMany((type) => Image, (image) => image.posting)
  images: Image[];

  @OneToMany((type) => Comment, (comment) => comment.posting)
  comments: Comment[];
}
