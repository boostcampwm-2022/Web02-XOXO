import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserInterface } from './entityInterfaces/UserInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';

@Entity({ schema: process.env.DB_DATABASE, name: 'heart' })
export default class Like {
  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne('User', 'likes', { onDelete: 'CASCADE' })
  user: UserInterface;

  @PrimaryColumn({ type: 'int', name: 'postingId' })
  @ManyToOne('Feed', { onDelete: 'CASCADE' })
  posting: PostingInterface;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
