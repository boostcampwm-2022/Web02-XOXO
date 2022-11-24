import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserInterface } from './entityInterfaces/UserInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';

@Entity({ schema: 'xoxo', name: 'heart' })
export default class Like {
  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne('User', 'feeds')
  user: UserInterface;

  @PrimaryColumn({ type: 'int', name: 'postingId' })
  @ManyToOne('Feed')
  posting: PostingInterface;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
