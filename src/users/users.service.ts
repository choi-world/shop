import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AddressesRepository } from './addresses.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly addressesRepository: AddressesRepository,
  ) {}
}

