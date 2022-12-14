import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import Posting from '@root/entities/Posting.entity';
import { Repository } from 'typeorm';

@CustomRepository(Posting)
export class PostingRepository extends Repository<Posting> {
  async getPosting(postingId: number, encryptedFeedId: string, feedId: number) {
    const posting = this.find({
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
}
