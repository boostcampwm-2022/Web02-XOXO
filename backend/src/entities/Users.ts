import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ schema: 'xoxo', name: 'users' })
export default class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 15 })
  nickname: string;

  // to-do: url 판단 validatation annotation 추가
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'profile' })
  profile: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'kakaoId', length: 20 })
  kakaoId: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
