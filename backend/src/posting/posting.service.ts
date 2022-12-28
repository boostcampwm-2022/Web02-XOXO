import { Injectable } from '@nestjs/common';
import { decrypt } from '@root/feed/feed.utils';
import Posting from '@root/entities/Posting.entity';
import { DataSource } from 'typeorm';
import { ImageRepository } from '@root/image/image.repository';
import { CreatePostingDecoratorDto } from './dto/create.posting.dto';
import LookingPostingDto from './dto/looking.posting.dto';
import { PostingRepository } from './posting.repository';
import PostingScrollDto from './dto/posting.scroll.dto';

@Injectable()
export class PostingService {
  constructor(
    private postingRepository: PostingRepository,
    private imageRepository: ImageRepository,
    private dataSource: DataSource,
  ) {}

  async getPosting(postingId: number, encryptedFeedId: string) {
    const feedId = Number(decrypt(encryptedFeedId));
    const posting = await this.postingRepository.getPosting(postingId, feedId);
    return LookingPostingDto.createLookingPostingDto(posting[0]);
  }

  async createPosting({
    createPostingDto,
    imageList,
  }: CreatePostingDecoratorDto) {
    let posting: Posting;
    await this.dataSource.transaction(async (manager) => {
      const postingRepository = manager.withRepository(this.postingRepository);
      const imageRepository = manager.withRepository(this.imageRepository);

      posting = await postingRepository.savePosting(createPostingDto);

      const insertImageList = imageList.map((imageUrl) => {
        return { posting, url: imageUrl };
      });

      await imageRepository.saveImage(insertImageList);
    });
    return posting.id;
  }

  async getPostingThumbnails(
    encryptedFeedId: string,
    postingScrollDto: PostingScrollDto,
  ) {
    const feedId = Number(decrypt(encryptedFeedId));
    const postingThumbnailList = await this.postingRepository.getThumbnailList(
      postingScrollDto,
      feedId,
    );
    return postingThumbnailList;
  }
}
