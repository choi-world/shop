import { Generated } from 'kysely';

export interface AuthTable {
  auth_idx: string;
  user_idx: string;
  account_name: string;
  password?: string | null;
  status: Generated<string>;
  type: Generated<string>;
  social_idx?: string | null;
  password_udt_dt?: Date | null;
  ci?: string | null;
  reg_dt: Generated<Date>;
  udt_dt?: Date | null;
}
