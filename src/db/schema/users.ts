export interface UsersTable {
  user_idx: string;
  username: string;
  phone_number: string | null;
  birthday: string | null;
  email: string | null;
  gender: boolean;
  status: string;
  role: string;
  is_agree: boolean;
  reg_dt: Date;
  udt_dt: Date | null;
  del_dt: Date | null;
}
