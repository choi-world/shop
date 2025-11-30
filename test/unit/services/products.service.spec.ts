import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../../src/products/products.service';
import { ProductsRepository } from '../../../src/products/products.repository';
import { ProductsTable } from '../../../src/db/schema/products';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;

  const mockProduct: ProductsTable = {
    product_idx: 'test-product-id',
    product_name: 'Test Product',
    description: 'Test Description',
    price: 10000,
    stock: 100,
    category: 'electronics',
    status: 'ACTIVE',
    image_url: 'https://example.com/image.jpg',
    reg_dt: new Date(),
    udt_dt: null,
    del_dt: null,
  };

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

  // 예시 테스트 케이스: 상품 조회 기능 테스트
  describe('findById', () => {
    it('should return a product when found', async () => {
      // Arrange
      const productId = 'test-product-id';
      productsRepository.findById = jest.fn().mockResolvedValue(mockProduct);

      // Act
      const result = await service.findById(productId);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
      expect(productsRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when product not found', async () => {
      // Arrange
      const productId = 'non-existent-id';
      productsRepository.findById = jest.fn().mockResolvedValue(null);

      // Act
      const result = await service.findById(productId);

      // Assert
      expect(result).toBeNull();
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
    });
  });
});

