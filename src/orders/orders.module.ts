import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrderItemsRepository, OrdersService],
  exports: [OrdersService, OrdersRepository, OrderItemsRepository],
})
export class OrdersModule {}
