export interface OrdersTable {
  order_idx: string;
  user_idx: string;
  address_idx: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  reg_dt: Date;
  udt_dt: Date | null;
  del_dt: Date | null;
}
