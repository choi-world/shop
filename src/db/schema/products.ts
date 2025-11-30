export interface ProductsTable {
  product_idx: string;
  product_name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  status: string;
  image_url: string | null;
  reg_dt: Date;
  udt_dt: Date | null;
  del_dt: Date | null;
}
