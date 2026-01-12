import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly http: HttpService,
  ) {}

  /**
   * 세션 불러오기
   * @param userId 유저 인덱스
   * @returns 쿠키에 존재하는 액세스 토큰 확인
   */
  async me(userId: string) {
    try {
      const user = await this.userRepository.findUsers({ userId });
      if (user && user.length < 1) throw new HttpException('유저 정보를 확인할 수 없습니다.', HttpStatus.NOT_FOUND);

      return user[0];
    } catch (e) {
      throw e;
    }
  }
}
