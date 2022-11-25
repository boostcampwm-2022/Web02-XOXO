import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommentInterface } from './entityInterfaces/CommentInterface';
import { FeedInterface } from './entityInterfaces/FeedInterface';
import { ImageInterface } from './entityInterfaces/ImageInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';
import { UserInterface } from './entityInterfaces/UserInterface';

@Entity({ schema: 'xoxo', name: 'postings' })
export default class Posting implements PostingInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar')
  letter: string;

  @IsNotEmpty()
  @IsUrl()
  @Column('varchar')
  thumbnail: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne('User')
  sender: UserInterface;

  @ManyToOne('Feed', 'postings')
  feed: FeedInterface;

  @OneToMany('Image', 'posting')
  images: ImageInterface[];

  @OneToMany('Comment', 'posting')
  comments: CommentInterface[];
}
