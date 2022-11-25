import { Test, TestingModule } from '@nestjs/testing';
import { PostingService } from './posting.service';

describe('PostingService', () => {
  let service: PostingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostingService],
    }).compile();

    service = module.get<PostingService>(PostingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
