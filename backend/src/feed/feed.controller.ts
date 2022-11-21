import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateFeedDto from './dto/create.feed.dto';
import { FeedService } from './feed.service';
import { Feed } from 'src/customDecorator/feed.decorator';
import userIdDto from './dto/create.userId.dto';
import {
  createCipher,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'crypto';
import { promisify } from 'util';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async post(
    @Body('userId') userId: number,
    @Feed() createFeedDto: CreateFeedDto,
  ) {
    const id = new userIdDto(userId);
    const feed = await this.feedService.createFeed(createFeedDto, id.userId);

    const iv = randomBytes(16);
    const key = process.env.SECRET_KEY;

    const cipher = createCipheriv('aes-256-cbc', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(feed.id.toString()),
      cipher.final(),
    ]).toString('hex');

    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const encrypt = Buffer.from(encryptedText, 'hex');
    const decryptedText = Buffer.concat([
      decipher.update(encrypt),
      decipher.final(),
    ]).toString();

    console.log(encryptedText, decryptedText);

    return encryptedText;
  }
}
