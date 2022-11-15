import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ schema: 'xoxo', name: 'users' })
export default class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nickname', length: 15 })
  nickname: string;

  @Column('varchar', { name: 'profile' })
  profile: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
