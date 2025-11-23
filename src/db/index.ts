import { AuthTable } from './schema/auth';
import { UsersTable } from './schema/users';

export interface Schema {
  users: UsersTable;
  auth: AuthTable;
}
