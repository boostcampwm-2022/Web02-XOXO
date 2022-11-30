import { Entity, DeleteDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserInterface } from '@root/entities/entityInterfaces/UserInterface';
import { PostingInterface } from '@root/entities/entityInterfaces/PostingInterface';

@Entity({ schema: 'xoxo', name: 'heart' })
export default class Like {
  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne('User', 'likes')
  user: UserInterface;

  @PrimaryColumn({ type: 'int', name: 'postingId' })
  @ManyToOne('Feed')
  posting: PostingInterface;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
