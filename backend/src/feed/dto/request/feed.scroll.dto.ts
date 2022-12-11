import { IsNotEmpty, IsNumberString } from 'class-validator';

export default class FeedScrollDto {
  @IsNotEmpty()
  @IsNumberString()
  size: number;

  @IsNotEmpty()
  @IsNumberString()
  index: number;
}
