import { AddressesTable } from './schema/addresses';
import { AuthTable } from './schema/auth';
import { OrderItemsTable } from './schema/order_items';
import { OrdersTable } from './schema/orders';
import { ProductsTable } from './schema/products';
import { UsersTable } from './schema/users';

export interface Schema {
  users: UsersTable;
  auth: AuthTable;
  addresses: AddressesTable;
  products: ProductsTable;
  orders: OrdersTable;
  order_items: OrderItemsTable;
}
