import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
