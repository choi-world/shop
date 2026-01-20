import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { RedisService } from 'src/common/redis/redis.service';
import { AccountService } from 'src/shop/account/account.service';
import { AuthRepository } from 'src/shop/auth/auth.repository';
import { UsersRepository } from 'src/shop/users/users.repository';
import * as modules from 'src/common/modules/modules';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => {
  const actual = jest.requireActual('crypto');
  return {
    ...actual,
    randomUUID: jest.fn(),
  };
});

describe('AccountService', () => {
  let service: AccountService;

  const jwtMock = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
  };

  const authRepositoryMock = {
    insertAuth: jest.fn(),
  };

  const usersRepositoryMock = {
    insertUsers: jest.fn(),
  };

  const redisMock = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: AuthRepository, useValue: authRepositoryMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: RedisService, useValue: redisMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = moduleRef.get(AccountService);
  });

  describe('회원가입', () => {
    it('카카오 로그인으로 접근한 유저가 회원가입을 하면 가입이 되고 액세스 토큰과 리프레시 토큰을 반환한다.', async () => {
      const registerDto = {
        socialId: '12345678',
        username: '홍길동',
        phoneNumber: '010-1234-5678',
        type: 'kakao',
        birthday: '1996-11-21',
        email: 'test@naver.com',
        gender: 1,
        accountName: null,
        password: null,
      } as any;

      usersRepositoryMock.insertUsers.mockResolvedValue(undefined);
      authRepositoryMock.insertAuth.mockResolvedValue(undefined);

      jwtMock.verifyAsync.mockResolvedValue(null);

      jest.spyOn(modules, 'randomAccountName').mockReturnValue('wdXACPsDUTNS');

      (randomUUID as jest.Mock).mockReturnValueOnce('user-uuid').mockReturnValueOnce('rand-uuid').mockReturnValueOnce('auth-uuid');

      jwtMock.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

      redisMock.set.mockResolvedValue('OK');

      const result = await service.register(registerDto);

      expect(usersRepositoryMock.insertUsers).toHaveBeenCalledWith({
        ...registerDto,
        user_idx: 'user-uuid',
      });

      expect(authRepositoryMock.insertAuth).toHaveBeenCalledWith({
        account_name: 'kakao:wdXACPsDUTNS',
        password: registerDto.password,
        user_idx: 'user-uuid',
        auth_idx: 'auth-uuid',
        social_idx: registerDto.socialId,
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
