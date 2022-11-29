import { Test, TestingModule } from '@nestjs/testing';
import { PostingController } from './posting.controller';

describe('PostingController', () => {
  let controller: PostingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostingController],
    }).compile();

    controller = module.get<PostingController>(PostingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
