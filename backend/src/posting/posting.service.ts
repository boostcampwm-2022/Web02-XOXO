import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Posting from '@root/entities/Posting.entity';
import { decrypt } from '@root/feed/feed.utils';
import Image from '@root/entities/Image.entity';
import { CreatePostingDto } from './dto/create.posting.dto';
import LookingPostingDto from './dto/looking.posting.dto';
import { PostingRepository } from './posting.repository';
import PostingScrollDto from './dto/posting.scroll.dto';

@Injectable()
export class PostingService {
  constructor(
    private postingRepository: PostingRepository,
    private dataSource: DataSource,
  ) {}

  async getPosting(postingId: number, encryptedFeedId: string) {
    const feedId = Number(decrypt(encryptedFeedId));
    const posting = await this.postingRepository.getPosting(
      postingId,
      encryptedFeedId,
      feedId,
    );
    return LookingPostingDto.createLookingPostingDto(posting[0]);
  }

  async createPosting(
    { letter, thumbnail, senderId, encryptedFeedId }: CreatePostingDto,
    imageUrlList: string[],
  ) {
    const feedId = Number(decrypt(encryptedFeedId));
    let posting;
    await this.dataSource.transaction(async (manager) => {
      posting = await manager.save(Posting, {
        letter,
        thumbnail,
        senderId,
        feedId,
      });
      for await (const imageUrl of imageUrlList) {
        await manager.insert(Image, { posting, url: imageUrl });
      }
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
