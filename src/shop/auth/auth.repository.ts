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

  async insertAuth(data: Record<string, any>): Promise<any> {
    let q = this.db.insertInto('auth').values({
      auth_idx: data.auth_idx,
      user_idx: data.user_idx,
      account_name: data.account_name,
      password: data.password ? data.password : null,
      social_idx: data.social_idx,
    });

    return q.executeTakeFirst();
  }

  async findAdminAuth(where: Record<string, any>): Promise<any> {
    let q = this.db.selectFrom('auth').selectAll('auth');

    if (where.userIdx && where.userIdx != '') q = q.where('auth.user_idx', '=', where.userIdx);
    if (where.accountName && where.accountName != '') q = q.where('auth.account_name', '=', where.accountName);

    return q.execute();
  }
}
