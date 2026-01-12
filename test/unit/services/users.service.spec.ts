import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/shop/users/users.service';
import { UsersRepository } from '../../../src/shop/users/users.repository';
import { AddressesRepository } from '../../../src/shop/users/addresses.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let addressesRepository: jest.Mocked<AddressesRepository>;

  beforeEach(async () => {
    const mockUsersRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const mockAddressesRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: AddressesRepository,
          useValue: mockAddressesRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    addressesRepository = module.get(AddressesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have usersRepository injected', () => {
    expect(usersRepository).toBeDefined();
  });

  it('should have addressesRepository injected', () => {
    expect(addressesRepository).toBeDefined();
  });
});
