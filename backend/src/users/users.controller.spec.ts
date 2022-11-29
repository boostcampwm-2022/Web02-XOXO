import { Test, TestingModule } from '@nestjs/testing';
import UsersController from './users.controller';

const MockExecutionContext: Partial<
  Record<jest.FunctionPropertyNames<ExecutionContext>, jest.MockFunction<any>>
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn(),
    getResponse: jest.fn(),
  }),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('로그아웃', () => {
    expect(controller).toBeDefined();
  });
});
