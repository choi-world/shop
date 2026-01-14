import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AccountService } from './account.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.accountService.register(registerDTO);

    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax', path: '/' });

    return { ok: true };
  }
}
