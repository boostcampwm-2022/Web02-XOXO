import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { UserInterface } from '@root/entities/entityInterfaces/UserInterface';

import Like from '@root/entities/Like.entity';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';

@Entity({ schema: process.env.DB_DATABASE, name: 'users' })
export default class User implements UserInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @Index({ fulltext: true, parser: 'ngram' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 15 })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Column('varchar', { name: 'profile' })
  profile: string;

  @IsNotEmpty()
  @Column('bigint', { name: 'kakaoId', unique: true, unsigned: true })
  kakaoId: number;

  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Column('char', { name: 'hashedNickname', length: 32 })
  hashedNickname: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(
    (type) => UserFeedMapping,
    (userFeedMapping) => userFeedMapping.user,
  )
  feeds: UserFeedMapping[];

  @OneToMany((type) => Like, (like) => like.posting)
  likes: Like[];

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken?: string;

  @Column({ nullable: true })
  lastVistedFeed?: number;
}
