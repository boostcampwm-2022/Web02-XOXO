import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Like from './Like.entity';
import UserFeedMapping from './UserFeedMapping.entity';

@Entity({ schema: 'xoxo', name: 'users' })
export default class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 15, unique: true })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Column('varchar', { name: 'profile' })
  profile: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'kakaoId', length: 20, unique: true })
  kakaoId: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(
    (type) => UserFeedMapping,
    (userFeedMapping) => userFeedMapping.user,
  )
  feeds: UserFeedMapping[];

  @OneToMany((type) => Like, (like) => like.posting)
  likes: Like[];
}
