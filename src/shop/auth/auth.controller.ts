import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax', path: '/' });

    return { ok: true };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new HttpException('유효하지 않은 로그인입니다.', HttpStatus.UNAUTHORIZED);

    const accessToken = await this.authService.refresh(refreshToken);

    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });

    return { ok: true };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { userId } = (req as any).user;
    const refreshToken = req.cookies?.refresh_token;
    if (!userId) throw new HttpException('유효하지 않은 로그인입니다.', HttpStatus.UNAUTHORIZED);

    await this.authService.logout(userId, refreshToken);

    res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax', secure: true });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'lax', secure: true });

    return { ok: true };
  }
}
