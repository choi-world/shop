import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { UsersRepository } from '../users/users.repository';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    // 다른 도메인의 Repository 사용 예시
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
}

