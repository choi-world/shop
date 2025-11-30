export interface OrderItemsTable {
  order_item_idx: string;
  order_idx: string;
  product_idx: string;
  quantity: number;
  price: number;
  reg_dt: Date;
  udt_dt: Date | null;
}
