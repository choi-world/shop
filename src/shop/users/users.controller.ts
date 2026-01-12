import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const { userId } = (req as any).user;
    if (!userId) throw new HttpException('유효하지 않은 로그인입니다.', HttpStatus.UNAUTHORIZED);

    const info = await this.usersService.me(userId);

    return { ok: true, info };
  }
}
