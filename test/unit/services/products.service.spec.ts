import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../../src/products/products.service';
import { ProductsRepository } from '../../../src/products/products.repository';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    const mockProductsRepository = {
      // Repository 메서드들을 모킹할 수 있는 공간
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have productsRepository injected', () => {
    expect(productsRepository).toBeDefined();
  });
});

