export interface AuthTable {
  auth_idx: string;
  user_idx: string;
  account_name: string;
  password: string | null;
  status: string;
  type: string;
  social_idx: string | null;
  password_udt_dt: Date | null;
  ci: string | null;
  reg_dt: Date;
  udt_dt: Date | null;
}
