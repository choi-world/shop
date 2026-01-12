import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../../db';

@Injectable()
export class AuthRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}

  async findAuth(where: Record<string, any>): Promise<any> {
    let q = this.db.selectFrom('auth').innerJoin('users', 'auth.user_idx', 'users.user_idx').selectAll('auth').selectAll('users');

    if (where.socialId && where.socialId != '') q = q.where('auth.social_idx', '=', where.socialId);

    return q.execute();
  }
}
