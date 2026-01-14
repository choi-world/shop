import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RedisService } from 'src/common/redis/redis.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AccountController],
  providers: [AccountService, JwtService, RedisService],
  exports: [],
})
export class AccountModule {}
