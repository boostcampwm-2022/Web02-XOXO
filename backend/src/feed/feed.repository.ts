import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import { Feed } from '@root/entities/Feed.entity';
import { Repository } from 'typeorm';

@CustomRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async getFeed(id: number) {}
}
