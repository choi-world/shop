import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, JwtStrategy, JwtService, RedisService],
  exports: [AuthRepository],
})
export class AuthModule {}
