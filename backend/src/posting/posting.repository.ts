import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import Image from '@root/entities/Image.entity';
import Posting from '@root/entities/Posting.entity';
import { DataSource, LessThan, Repository } from 'typeorm';
import { CreatePostingDecoratorDto } from './dto/create.posting.dto';
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

  async savePosting({
    createPostingDto,
    imageList,
  }: CreatePostingDecoratorDto) {
    let posting: Posting;
    await this.manager.transaction(async (manager) => {
      posting = await manager.save(Posting, createPostingDto);

      const insertImageList = imageList.map((imageUrl) => {
        return { posting, url: imageUrl };
      });

      await manager
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values(insertImageList)
        .updateEntity(false)
        .execute();
    });
    return posting.id;
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
