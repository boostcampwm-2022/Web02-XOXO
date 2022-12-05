import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Posting from '@root/entities/Posting.entity';
import { DBError, NonExistFKConstraintError } from '@root/error/serverError';
import FindPostingDto from '@posting/dto/find.posting.dto';
import { decrypt, encrypt } from '@root/feed/feed.utils';
import Image from '@root/entities/Image.entity';
import { CreatePostingDto } from './dto/create.posting.dto';

@Injectable()
export class PostingService {
  constructor(
    @InjectRepository(Posting) private postingRepository: Repository<Posting>,
    private dataSource: DataSource,
  ) {}

  async getPosting(findPostingDto: FindPostingDto & Record<string, unknown>) {
    try {
      const posting = await this.postingRepository.find({
        where: findPostingDto,
        relations: ['feed'],
      });
      return posting;
    } catch (e) {
      throw new DBError('DBError: getUser 오류');
    }
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
      const errorType = e.code;
      await queryRunner.rollbackTransaction();

      if (errorType === 'ER_NO_REFERENCED_ROW_2')
        throw new NonExistFKConstraintError(
          '존재하지 않는 유저, 또는 피드 입니다.',
        );

      throw new DBError('DBError: createPosting 오류');
    } finally {
      await queryRunner.release();
    }
  }
}
