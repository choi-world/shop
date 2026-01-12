import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../../db';

@Injectable()
export class OrderItemsRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}
}

