import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../db';

@Injectable()
export class AuthRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}
}

