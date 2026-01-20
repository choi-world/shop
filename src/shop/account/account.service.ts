import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { AuthRepository } from '../auth/auth.repository';
import { randomAccountName } from 'src/common/modules/modules';
import { RegisterDTO } from './dto/register.dto';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly redis: RedisService,
    private jwt: JwtService,
  ) {}

  /**
   * 회원가입
   * @param registerDTO 부가로 받은 정보 또는 회원가입 페이지로부터 얻은 유저 정보
   * @returns 회원가입
   */
  async register(registerDTO: RegisterDTO): Promise<Record<string, any>> {
    try {
      let accountName: string = '';
      let password: string | null = '';

      switch (registerDTO.type) {
        case 'kakao':
        case 'naver':
          accountName = randomAccountName(12);
          accountName = `${registerDTO.type}:${accountName}`;
          password = registerDTO.password ? registerDTO.password : null;
          break;
        default:
          break;
      }

      const userIdx = randomUUID();
      const random = randomUUID();

      await this.usersRepository.insertUsers({ ...registerDTO, user_idx: userIdx });
      await this.authRepository.insertAuth({
        account_name: accountName,
        password,
        user_idx: userIdx,
        auth_idx: randomUUID(),
        social_idx: registerDTO.socialId,
      });

      const accessToken = await this.jwt.signAsync({ sub: userIdx }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const refreshToken = await this.jwt.signAsync({ sub: userIdx, randomUUID: random }, { secret: process.env.JWT_SECRET, expiresIn: '14d' });

      await this.redis.set(`refresh:${userIdx}:${random}`, '1', 60 * 60 * 24 * 14);

      return { accessToken, refreshToken };
    } catch (e) {
      throw e;
    }
  }
}
