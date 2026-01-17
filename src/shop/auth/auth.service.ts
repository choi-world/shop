import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDTO } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly http: HttpService,
    private readonly redis: RedisService,
    private jwt: JwtService,
  ) {}

  /**
   * 로그인
   * @param loginDto 로그인 정보
   * @returns 로그인 결과
   */
  async login(loginDto: LoginDTO, checkRefreshToken: string): Promise<Record<string, any>> {
    let authInfo: Record<string, any> = {};
    let payload: any;

    if (checkRefreshToken) payload = await this.jwt.verifyAsync(checkRefreshToken, { secret: process.env.JWT_SECRET });

    if (payload) {
      const role = payload.role;
      if (role == 'ADMIN') throw new HttpException('올바르지 않는 접근입니다. 브라우저를 종료하고 다시 접근해주세요.', HttpStatus.BAD_REQUEST);
    }

    // 2026.01.18 이미 로그인한 경우에는 서드파티를 거치지 않고 로그인할 수 있도록 추가가 필요해보임?

    try {
      switch (loginDto.type) {
        case 'kakao':
        case 'naver':
          authInfo = await this.thirdPartyLogin(loginDto);
          break;
        default:
          break;
      }
      const authCheck = await this.authRepository.findAuth(authInfo);
      if (authCheck && authCheck.length < 1)
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: '사용자를 찾을 수 없습니다.',
            info: authInfo,
          },
          HttpStatus.NOT_FOUND,
        );

      const randomUUID = crypto.randomUUID();
      const accessToken = await this.jwt.signAsync({ sub: authCheck[0].user_idx }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const refreshToken = await this.jwt.signAsync(
        { sub: authCheck[0].user_idx, randomUUID, role: 'USER' },
        { secret: process.env.JWT_SECRET, expiresIn: '14d' },
      );

      await this.redis.set(`refresh:${authCheck[0].user_idx}:${randomUUID}`, '1', 60 * 60 * 24 * 14);

      return { accessToken, refreshToken };
    } catch (e) {
      throw e;
    }
  }

  /**
   * 리프레시 토큰
   * @param refreshToken 리프레시 토큰
   * @returns 리프레시 토큰 활용한 액세스 토큰 재발급
   */
  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET });
      if (!payload) throw new HttpException('페이로드를 불러올 수 없습니다.', HttpStatus.UNAUTHORIZED);

      const userId = payload.sub;
      const randomUUID = payload.randomUUID;
      if (!userId || !randomUUID) throw new HttpException('유저 정보를 확인할 수 없습니다.', HttpStatus.UNAUTHORIZED);

      const checkRedis = await this.redis.get(`refresh:${userId}:${randomUUID}`);
      if (!checkRedis) throw new HttpException('리프레시 토큰이 만료되었습니다.', HttpStatus.UNAUTHORIZED);

      const newAccessToken = await this.jwt.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      );

      return newAccessToken;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 로그아웃
   * @param refreshToken 리프레시 토큰
   * @returns 로그아웃
   */
  async logout(refreshToken: string): Promise<boolean> {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET });
      if (!payload) throw new HttpException('페이로드를 불러올 수 없습니다.', HttpStatus.UNAUTHORIZED);

      const userId = payload.sub;
      const randomUUID = payload.randomUUID;
      if (!userId || !randomUUID) throw new HttpException('유저 정보를 확인할 수 없습니다.', HttpStatus.UNAUTHORIZED);

      await this.redis.del(`refresh:${userId}:${randomUUID}`);

      return true;
    } catch (e) {
      throw e;
    }
  }

  private async thirdPartyLogin(loginDto: LoginDTO): Promise<Record<string, any>> {
    try {
      if (!loginDto.code) throw new HttpException('소셜 측 재로그인이 필요합니다.', HttpStatus.FORBIDDEN);

      const accessToken = await this.getAccessToken(loginDto);

      let callSocial: any;
      let body: any;
      let userInfo: Record<string, any> = {};
      switch (loginDto.type) {
        case 'kakao':
          body = new URLSearchParams({
            property_keys: JSON.stringify(['kakao_account.email']),
          });

          callSocial = await lastValueFrom(
            this.http.post('https://kapi.kakao.com/v2/user/me', body, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          );

          userInfo = {
            socialId: String(callSocial.data.id),
            userEmail: callSocial.data.kakao_account.email,
            type: loginDto.type,
          };
          break;
        case 'naver':
          break;
        default:
          break;
      }

      return userInfo;
    } catch (e) {
      throw e;
    }
  }

  private async getAccessToken(loginDto: LoginDTO): Promise<string> {
    try {
      let callSocial: any;
      let body: any;
      let accessToken: string = '';

      switch (loginDto.type) {
        case 'kakao':
          body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY!,
            redirect_uri: process.env.KAKAO_REDIRECT_URI!,
            code: loginDto.code,
            client_secret: process.env.KAKAO_SECRET_CODE!,
          });

          callSocial = await lastValueFrom(
            this.http.post('https://kauth.kakao.com/oauth/token', body, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );

          if (callSocial.error && callSocial.error != '')
            throw new HttpException('로그인에 오류가 발생했습니다. 다시 로그인해주세요.', HttpStatus.INTERNAL_SERVER_ERROR);

          accessToken = callSocial.data.access_token ? callSocial.data.access_token : null;
          break;
        case 'naver':
          break;
        default:
          break;
      }
      if (!accessToken || accessToken == '') throw new HttpException('토큰 발행에 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);

      return accessToken;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 관리자 로그인
   * @param loginDTO 로그인 정보
   * @returns 관리자 로그인
   */
  async adminLogin(loginDTO: LoginDTO, checkRefreshToken: string): Promise<Record<string, any>> {
    let payload: any;

    if (checkRefreshToken) payload = await this.jwt.verifyAsync(checkRefreshToken, { secret: process.env.JWT_SECRET });
    const param: Record<string, any> = {};

    if (payload) {
      const role = payload.role;
      if (role == 'USER') throw new HttpException('올바르지 않는 접근입니다. 브라우저를 종료하고 다시 접근해주세요.', HttpStatus.BAD_REQUEST);

      param.userIdx = payload.sub;
    } else {
      param.accountName = loginDTO.account;
    }

    const adminAccount = await this.authRepository.findAdminAuth(param);
    if (adminAccount.length < 1) throw new HttpException('존재하지 않는 유저입니다.', HttpStatus.NOT_FOUND);

    if (loginDTO.password && loginDTO.password != '') {
      const passwordMatch = await bcrypt.compare(loginDTO.password, adminAccount[0].password);
      if (!passwordMatch) throw new HttpException('비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const randomUUID = crypto.randomUUID();
    const accessToken = await this.jwt.signAsync({ sub: adminAccount[0].user_idx }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync(
      { sub: adminAccount[0].user_idx, randomUUID, role: 'ADMIN' },
      { secret: process.env.JWT_SECRET, expiresIn: '14d' },
    );

    await this.redis.set(`refresh:${adminAccount[0].user_idx}:${randomUUID}`, '1', 60 * 60 * 24 * 14);

    return { accessToken, refreshToken };
  }
}
