import { IsDate, IsDateString, IsNotEmpty, IsUrl } from 'class-validator';
import { IsValidFeedName } from 'src/customValidators/feedValidate';
import createFeedDto from 'src/feed/dto/create.feed.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Posting from './Posting.entity';
import UserFeedMapping from './UserFeedMapping.entity';

@Entity({ schema: 'xoxo', name: 'feeds' })
export class Feed {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsValidFeedName()
  @Column({ type: 'varchar', length: 15 })
  name: string;

  @IsUrl()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  thumbnail: string;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  description: string;

  @IsNotEmpty()
  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column('int', { default: 0 })
  memberCount: number;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany((type) => Posting, (posting) => posting.feed)
  postings: Posting[];

  @OneToMany(
    (type) => UserFeedMapping,
    (userFeedMapping) => userFeedMapping.feed,
  )
  users: UserFeedMapping[];
}
