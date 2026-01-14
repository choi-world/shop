import { Generated } from 'kysely';

export interface UsersTable {
  user_idx: string;
  username: string;
  phone_number?: string | null;
  birthday?: string | null;
  email?: string | null;
  gender: Generated<boolean>;
  status: Generated<string>;
  role: Generated<string>;
  is_agree: Generated<boolean>;
  reg_dt: Generated<Date>;
  udt_dt?: Date | null;
  del_dt?: Date | null;
}
