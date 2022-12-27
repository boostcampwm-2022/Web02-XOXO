import { IsNotEmpty, IsNumberString, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ImageInterface } from '@root/entities/entityInterfaces/ImageInterface';
import { PostingInterface } from '@root/entities/entityInterfaces/PostingInterface';

@Entity({ schema: process.env.DB_DATABASE, name: 'images' })
export default class Image implements ImageInterface {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @IsNotEmpty()
  id: number;

  @IsUrl()
  @IsNotEmpty()
  @Column('varchar')
  url: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @IsNotEmpty()
  @IsNumberString()
  @Column({ type: 'int' })
  postingId: number;

  @ManyToOne('Posting', 'images', { onDelete: 'CASCADE' })
  posting: PostingInterface;
}
