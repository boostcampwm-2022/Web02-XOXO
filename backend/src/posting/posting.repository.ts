import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import Posting from '@root/entities/Posting.entity';
import { LessThan, Repository, DataSource } from 'typeorm';
import { CreatePostingDto } from './dto/create.posting.dto';
import PostingScrollDto from './dto/posting.scroll.dto';

@CustomRepository(Posting)
export class PostingRepository extends Repository<Posting> {
  async getPosting(postingId: number, feedId: number) {
    const posting = await this.find({
      where: { id: postingId, feed: { id: feedId } },
      relations: ['images', 'sender', 'feed'],
      select: {
        images: { url: true },
        sender: { nickname: true, profile: true },
        feed: { name: true },
      },
    });
    return posting;
  }

  async savePosting(createPostingDto: CreatePostingDto) {
    const posting = await this.save(createPostingDto);
    return posting;
  }

  async getThumbnailList(postingScrollDto: PostingScrollDto, feedId: number) {
    const { index: startPostingId, size: scrollSize } = postingScrollDto;

    const whereOption = startPostingId
      ? { feedId, id: LessThan(startPostingId) }
      : { feedId };

    const postingThumbnaillist = this.find({
      where: whereOption,
      select: { id: true, thumbnail: true },
      order: {
        id: 'DESC',
      },
      take: scrollSize,
    });
    return postingThumbnaillist;
  }
}
