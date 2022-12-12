import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserFeedMapping)
export class UserFeedMappingRepository extends Repository<UserFeedMapping> {
  async getFeedList(userId: number, isGroupFeed: boolean) {
    const feedList = await this.createQueryBuilder('user_feed_mapping')
      .innerJoin('user_feed_mapping.feed', 'feeds')
      .select([
        'feeds.id as id',
        'feeds.name as name',
        'feeds.thumbnail as thumbnail',
      ])
      .where('feeds.isGroupFeed = :isGroupFeed', { isGroupFeed })
      .andWhere('user_feed_mapping.userId = :userId', { userId })
      .getRawMany();
    return feedList;
  }
}
