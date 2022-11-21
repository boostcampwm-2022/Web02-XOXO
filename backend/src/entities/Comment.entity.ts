import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import Posting from './Posting.entity';
import User from './User.entity';

@Entity({ schema: 'xoxo', name: 'comments' })
export default class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  comment: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne((type) => Posting, (posting) => posting.comments)
  posting: Posting;

  @ManyToOne((type) => User)
  writer: User;
}
