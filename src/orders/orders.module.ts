import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';

@Module({
  imports: [DatabaseModule, ProductsModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrderItemsRepository, OrdersService],
  exports: [OrdersService, OrdersRepository, OrderItemsRepository],
})
export class OrdersModule {}

