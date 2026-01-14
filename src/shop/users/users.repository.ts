import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Schema } from '../../db';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private readonly db: Kysely<Schema>) {}

  async findUsers(where: Record<string, any>): Promise<any> {
    let q = this.db.selectFrom('users').selectAll();

    q = q.where('users.status', '=', 'ACTIVE');
    if (where.userId && where.userId != '') q = q.where('users.user_idx', '=', where.userId);

    return q.execute();
  }

  async insertUsers(data: Record<string, any>): Promise<any> {
    let q = this.db.insertInto('users').values({
      user_idx: data.user_idx,
      username: data.username,
      phone_number: data.phone_number ? data.phone_number : null,
      birthday: data.birthday ? data.birthday : null,
      email: data.email ? data.email : null,
      gender: data.gender ? data.gender : 0,
    });

    return q.executeTakeFirst();
  }
}
