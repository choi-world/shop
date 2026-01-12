import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/shop/auth/auth.service';
import { AuthRepository } from '../../../src/shop/auth/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(async () => {
    const mockAuthRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have authRepository injected', () => {
    expect(authRepository).toBeDefined();
  });
});

