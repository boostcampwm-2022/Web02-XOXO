import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'configuration';
import Feed from 'src/custom/customDecorator/feed.decorator';
import { DataSource } from 'typeorm';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let feedService: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `${process.cwd()}/config/.${process.env.NODE_ENV}.env`,
          load: [configuration],
        }),
      ],
      providers: [FeedService, ConfigService],
    })
      .useMocker((token) => {
        const queryRunner = {
          connect: jest.fn(),
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          release: jest.fn(),
          manager: {
            getRepository: (entity: unknown) => {
              return {
                save: jest.fn().mockImplementation((input) => {
                  return { id: 1 };
                }),
              };
            },
          },
        };

        if (token === DataSource) {
          return {
            createQueryRunner: () => {
              return queryRunner;
            },
          };
        }
      })
      .compile();

    feedService = module.get<FeedService>(FeedService);
  });

  describe('createFeed 정상 테스트', () => {
    const createFeedDto = {
      name: '피드1',
      thumbnail: 'navercom',
      description: '피드1입니다.',
      dueDate: new Date(),
    };
    const userId = 1;

    it('should return encrypted feed id', () => {
      return feedService.createFeed(createFeedDto, userId).then((data) => {
        expect(data).toBe('77cd8fa6cbf368f5799b13560f8846eb');
      });
    });
  });
});
