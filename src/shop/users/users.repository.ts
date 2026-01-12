import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../../db';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}

  async findUsers(where: Record<string, any>): Promise<any> {
    let q = this.db.selectFrom('users').selectAll();

    q = q.where('users.status', '=', 'ACTIVE');
    if (where.userId && where.userId != '') q = q.where('users.user_idx', '=', where.userId);

    return q.execute();
  }
}
