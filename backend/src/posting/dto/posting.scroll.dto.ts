import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export default class PostingScrollDto {
  @IsNotEmpty()
  @IsNumberString()
  size: number;

  @IsOptional()
  @IsNumberString()
  index?: number;
}
