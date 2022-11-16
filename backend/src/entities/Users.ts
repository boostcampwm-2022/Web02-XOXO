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

  // to-do: url 판단 validatation annotation 추가
  @Column('varchar', { name: 'profile' })
  profile: string;

  @Column('varchar', { name: 'kakaoId', length: 20 })
  kakaoId: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
