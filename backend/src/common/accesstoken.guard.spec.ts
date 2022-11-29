import { AuthenticationService } from 'src/authentication/authentication.service';

const MockExecutionContext: Partial<
  Record<jest.FunctionPropertyNames<ExecutionContext>, jest.MockFunction<any>>
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn(),
    getResponse: jest.fn(),
  }),
};

describe('AccessGuardTest', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      provide: [AuthenticationService],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('로그아웃', () => {
    expect(controller).toBeDefined();
  });
});
