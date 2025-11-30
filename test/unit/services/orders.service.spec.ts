import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../../src/orders/orders.service';
import { OrdersRepository } from '../../../src/orders/orders.repository';
import { OrderItemsRepository } from '../../../src/orders/order-items.repository';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<OrdersRepository>;
  let orderItemsRepository: jest.Mocked<OrderItemsRepository>;

  beforeEach(async () => {
    const mockOrdersRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const mockOrderItemsRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
        {
          provide: OrderItemsRepository,
          useValue: mockOrderItemsRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(OrdersRepository);
    orderItemsRepository = module.get(OrderItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have ordersRepository injected', () => {
    expect(ordersRepository).toBeDefined();
  });

  it('should have orderItemsRepository injected', () => {
    expect(orderItemsRepository).toBeDefined();
  });
});
