import { PickType } from '@nestjs/swagger';
import Image from '@root/entities/Image.entity';

export default class CreateImage extends PickType(Image, [
  'posting',
  'url',
] as const) {}
