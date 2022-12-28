import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import Image from '@root/entities/Image.entity';
import { Repository } from 'typeorm';
import CreateImage from './dto/create.image.dto';

@CustomRepository(Image)
export class ImageRepository extends Repository<Image> {
  async saveImage(createImageList: CreateImage[]) {
    await this.manager
      .createQueryBuilder()
      .insert()
      .into(Image)
      .values(createImageList)
      .updateEntity(false)
      .execute();
  }
}
