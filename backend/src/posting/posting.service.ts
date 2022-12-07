import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Posting from '@root/entities/Posting.entity';
import FindPostingDto from '@posting/dto/find.posting.dto';
import { decrypt } from '@root/feed/feed.utils';
import Image from '@root/entities/Image.entity';
import { CreatePostingDto } from './dto/create.posting.dto';

@Injectable()
export class PostingService {
  constructor(
    @InjectRepository(Posting) private postingRepository: Repository<Posting>,
    private dataSource: DataSource,
  ) {}

  async getPosting(findPostingDto: FindPostingDto & Record<string, unknown>) {
    const posting = await this.postingRepository.find({
      where: findPostingDto,
      relations: ['feed'],
    });
    return posting;
  }

  async createPosting(
    { letter, thumbnail, senderId, encryptedFeedId }: CreatePostingDto,
    imageUrlList: string[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const feedId = Number(decrypt(encryptedFeedId));
      const posting = await queryRunner.manager
        .getRepository(Posting)
        .save({ letter, thumbnail, senderId, feedId });

      // Images 테이블에 삽입
      for await (const ImageUrl of imageUrlList) {
        await queryRunner.manager
          .getRepository(Image)
          .insert({ posting, url: ImageUrl });
      }

      await queryRunner.commitTransaction();
      return posting.id;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
