import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import { Feed } from '@root/entities/Feed.entity';
import { Repository } from 'typeorm';
import CreateFeedDto from './dto/create.feed.dto';
import FindFeedDto from './dto/find.feed.dto';

@CustomRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async getFeedByFindFeedDto(findFeedDto: FindFeedDto) {
    const feed = await this.find({ where: findFeedDto });
    return feed;
  }

  async getThumbnailList(
    startPostingId: number,
    scrollSize: number,
    id: number,
  ) {
    const postingThumbnaillist = await this.createQueryBuilder('feed')
      .innerJoin('feed.postings', 'posting')
      .select(['posting.id as id', 'posting.thumbnail as thumbanil'])
      .where('feed.id = :id', { id })
      .andWhere('posting.id > :startPostingId', { startPostingId })
      .limit(scrollSize)
      .getRawMany();
    return postingThumbnaillist;
  }

  async updateFeed(id: number, createFeedDto: CreateFeedDto) {
    await this.update(id, createFeedDto);
  }
}
