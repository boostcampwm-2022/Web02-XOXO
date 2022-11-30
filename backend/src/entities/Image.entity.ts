import { IsNotEmpty, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ImageInterface } from './entityInterfaces/ImageInterface';
import { PostingInterface } from './entityInterfaces/PostingInterface';

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

  @ManyToOne('Posting', 'images')
  posting: PostingInterface;
}
