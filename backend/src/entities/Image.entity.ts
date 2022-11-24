import { IsNotEmpty, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import Posting from './Posting.entity';

@Entity({ schema: 'xoxo', name: 'images' })
export default class Image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsUrl()
  @IsNotEmpty()
  @Column('varchar')
  url: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne((type) => Posting, (posting) => posting.images)
  posting: Posting;
}
