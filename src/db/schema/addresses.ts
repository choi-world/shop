export interface AddressesTable {
  address_idx: string;
  user_idx: string;
  address_name: string;
  recipient_name: string;
  phone_number: string;
  zip_code: string;
  address: string;
  detail_address: string | null;
  is_default: boolean;
  reg_dt: Date;
  udt_dt: Date | null;
  del_dt: Date | null;
}
