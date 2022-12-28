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

  async updateFeed(id: number, createFeedDto: CreateFeedDto) {
    await this.update(id, createFeedDto);
  }

  async saveFeed(createFeedDto: CreateFeedDto, isGroupFeed: boolean) {
    const feed = await this.save({ ...createFeedDto, isGroupFeed });
    return feed;
  }

  async findFeed(id: number) {
    const feed = await this.find({
      where: { id },
      relations: ['postings', 'users'],
      select: {
        postings: { id: true },
        users: { userId: true },
        name: true,
        description: true,
        thumbnail: true,
        dueDate: true,
        isGroupFeed: true,
      },
    });
    return feed;
  }
}
