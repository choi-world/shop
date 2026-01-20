import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtAppModule } from 'src/common/jwt/jwt.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [DatabaseModule, HttpModule, JwtAppModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, JwtStrategy],
  exports: [AuthRepository],
})
export class AuthModule {}
