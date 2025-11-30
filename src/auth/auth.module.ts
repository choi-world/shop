import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}

