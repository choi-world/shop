import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../../db';

@Injectable()
export class OrdersRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}
}
