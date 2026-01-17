import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { RedisService } from 'src/common/redis/redis.service';
import { AuthRepository } from 'src/shop/auth/auth.repository';
import { AuthService } from 'src/shop/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const jwtMock = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
  };

  const authRepositoryMock = {
    findAuth: jest.fn(),
  };

  const redisMock = {
    set: jest.fn(),
  };

  const httpMock = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('fixed-uuid' as any);
    process.env.JWT_SECRET = 'test-secret';

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: authRepositoryMock },
        { provide: HttpService, useValue: httpMock },
        { provide: RedisService, useValue: redisMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('로그인', () => {
    it('카카오로 로그인 시 액세스 토큰과 리프레시 토큰을 반환한다.', async () => {
      const loginDto = { type: 'kakao' } as any;

      // 쿠키에 남아있는 리프레시 토큰으로 인한 검증 로직을 실행시키지 않는다.
      jwtMock.verifyAsync.mockResolvedValue(null);

      // 카카오에서 로그인을 요청해 받았다.
      jest.spyOn(service as any, 'thirdPartyLogin').mockResolvedValue({
        socialId: '82821212',
        userEmail: 'test@naver.com',
        type: 'kakao',
      });

      // 가입되어 있다.
      authRepositoryMock.findAuth.mockResolvedValue([{ user_idx: 1 }]);

      // 토큰을 발급했다.
      jwtMock.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

      // redis에 저장했다.
      redisMock.set.mockResolvedValue('OK');

      // when
      const result = await service.login(loginDto, '');

      // then
      // 액세스 토큰과 리프레시 토큰을 응답했는가
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      // 서드파티 로그인을 호출했는가
      expect((service as any).thirdPartyLogin).toHaveBeenCalledWith(loginDto);

      // 유저 조회에 authInfo가 전달되었는가
      expect(authRepositoryMock.findAuth).toHaveBeenCalledWith({
        socialId: '82821212',
        userEmail: 'test@naver.com',
        type: 'kakao',
      });

      // 액세스 토큰이 발급되었는가
      expect(jwtMock.signAsync).toHaveBeenNthCalledWith(1, { sub: 1 }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });

      // 리프레시 토큰이 발급되었는가
      expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: 1, randomUUID: 'fixed-uuid', role: 'USER' },
        { secret: process.env.JWT_SECRET, expiresIn: '14d' },
      );

      // redis에 저장되었는가
      expect(redisMock.set).toHaveBeenCalledWith('refresh:1:fixed-uuid', '1', 60 * 60 * 24 * 14);
    });

    it('쿠키의 리프레시 토큰이 관리자 로그인으로 발급된 경우 400을 반환한다.', async () => {
      const loginDto = { type: 'kakao' } as any;

      jwtMock.verifyAsync.mockResolvedValue({
        role: 'ADMIN',
      });

      expect(service.login(loginDto, 'admin-refresh-token')).rejects.toMatchObject({
        status: 400,
      });
    });

    it('서드파티 로그인을 성공했으나 회원이 아닌 경우 404를 반환한다.', async () => {
      const loginDto = { type: 'kakao' } as any;

      jwtMock.verifyAsync.mockResolvedValue(null);

      jest.spyOn(service as any, 'thirdPartyLogin').mockResolvedValue({
        socialId: '82821212',
        userEmail: 'test@naver.com',
        type: 'kakao',
      });

      authRepositoryMock.findAuth.mockResolvedValue([]);

      expect(service.login(loginDto, '')).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
