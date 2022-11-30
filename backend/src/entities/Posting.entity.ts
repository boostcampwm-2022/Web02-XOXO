import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommentInterface } from '@root/entities/entityInterfaces/CommentInterface';
import { FeedInterface } from '@root/entities/entityInterfaces/FeedInterface';
import { ImageInterface } from '@root/entities/entityInterfaces/ImageInterface';
import { PostingInterface } from '@root/entities/entityInterfaces/PostingInterface';
import { UserInterface } from '@root/entities/entityInterfaces/UserInterface';

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
