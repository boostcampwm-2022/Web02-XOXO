import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { CommentInterface } from './entityInterfaces/CommentInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';
import { UserInterface } from './entityInterfaces/UserInterface';

@Entity({ schema: 'xoxo', name: 'comments' })
export default class Comment implements CommentInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  comment: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne('Posting', 'comments')
  posting: PostingInterface;

  @ManyToOne('User')
  writer: UserInterface;
}
