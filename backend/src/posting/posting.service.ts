import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Posting from '../entities/Posting.entity';
import { DBError } from '../error/serverError';
import FindPostingDto from './dto/find.posting.dto';

@Injectable()
export class PostingService {
  constructor(
    @InjectRepository(Posting) private postingRepository: Repository<Posting>,
  ) {}

  async getPosting(findPostingDto: FindPostingDto & Record<string, unknown>) {
    try {
      const posting = await this.postingRepository.find({
        where: findPostingDto,
        relations: ['feed'],
      });
      return posting;
    } catch (e) {
      throw new DBError('DBError: getUser 오류');
    }
  }
}
