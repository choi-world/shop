import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AddressesRepository } from './addresses.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [UsersController],
  providers: [UsersRepository, AddressesRepository, UsersService],
  exports: [UsersRepository, AddressesRepository],
})
export class UsersModule {}
