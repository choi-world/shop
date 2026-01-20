import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { JwtAppModule } from 'src/common/jwt/jwt.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [AuthModule, UsersModule, JwtAppModule, RedisModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [],
})
export class AccountModule {}
