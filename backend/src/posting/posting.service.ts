import { Injectable } from '@nestjs/common';
import { decrypt } from '@root/feed/feed.utils';
import { CreatePostingDecoratorDto } from './dto/create.posting.dto';
import LookingPostingDto from './dto/looking.posting.dto';
import { PostingRepository } from './posting.repository';
import PostingScrollDto from './dto/posting.scroll.dto';

@Injectable()
export class PostingService {
  constructor(private postingRepository: PostingRepository) {}

  async getPosting(postingId: number, encryptedFeedId: string) {
    const feedId = Number(decrypt(encryptedFeedId));
    const posting = await this.postingRepository.getPosting(postingId, feedId);
    return LookingPostingDto.createLookingPostingDto(posting[0]);
  }

  async createPosting(createPostingDecoratorDto: CreatePostingDecoratorDto) {
    const postingId = await this.postingRepository.savePosting(
      createPostingDecoratorDto,
    );
    return postingId;
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
