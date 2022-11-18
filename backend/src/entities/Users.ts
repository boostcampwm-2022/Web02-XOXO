import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
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
  @Column('varchar', { name: 'nickname', length: 15, unique: true })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Column('varchar', { name: 'profile' })
  profile: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'kakaoId', length: 20, unique: true })
  kakaoId: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
