import { IsNotEmpty, IsNumber } from 'class-validator';

export default class FeedScrollDto {
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  index: number;
}
