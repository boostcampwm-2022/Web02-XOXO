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

  async checkFeedOwner(userId: number, feedId: number) {
    const owner = await this.createQueryBuilder('user_feed_mapping')
      .where('user_feed_mapping.userId = :userId', { userId })
      .andWhere('user_feed_mapping.feedId = :feedId', { feedId })
      .getOne();
    return owner;
  }

  async getFeedMemberList(userId: number, feedId: number) {
    const feedMemberList = await this.createQueryBuilder('user_feed_mapping')
      .innerJoin('user_feed_mapping.user', 'users')
      .select(['users.id as id', 'users.nickname as nickname'])
      .where('user_feed_mapping.feedId  = :feedId', { feedId })
      .andWhere('user_feed_mapping.userId != :userId', { userId })
      .getRawMany();
    return feedMemberList;
  }

  async saveUserFeedMapping(feedId: number, userId: number) {
    await this.save({ feedId, userId });
  }

  async saveUserFeedMappingBulk(memberList: number[], feedId: number) {
    const userFeedMappingList = memberList.map((member) => {
      return { feedId, userId: member };
    });

    await this.createQueryBuilder()
      .insert()
      .into(UserFeedMapping)
      .values(userFeedMappingList)
      .updateEntity(false)
      .execute();
  }
}
