import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../db';

@Injectable()
export class ProductsRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}

  async findById(productIdx: string) {
    return this.db
      .selectFrom('products')
      .selectAll()
      .where('product_idx', '=', productIdx)
      .where('del_dt', 'is', null)
      .executeTakeFirst();
  }
}

