import { Test, TestingModule } from "@nestjs/testing";
import { ProductDto } from "src/application/product/product.dto";
import { Product } from "src/domain/product/product.entity";
import { productService } from "src/domain/product/product.service";
import { AppModule } from "src/infraestructure/app.module";
import { Failure, Success } from "src/utils/result";

describe('ProductService', () => {
  let service: productService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<productService>(productService);
  });

  describe('createProduct and getProduct', () => {
    
    
    it('should create and then return the same product', async () => {
      const product: ProductDto = {
        id: 1,
        name: 'Roma',
        description: 'Enterizo deportivo',
        price: 60000.50,
        stock:2,
        createdAt: new Date(),
      };

      const newProduct = await service.createProduct(product) as Success<Product>;
      const fetchedProduct = await service.getProduct(newProduct.value.id) as Success<ProductDto>;

      expect(fetchedProduct).toBeDefined();
      expect(fetchedProduct.value.id).toBe(newProduct.value.id)
      expect(fetchedProduct.value.name).toBe(newProduct.value.name)
      expect(fetchedProduct.value.price).toBe(newProduct.value.price)
      expect(fetchedProduct.value.stock).toBe(newProduct.value.stock)

    });

    it('should return a failure when find an inexistent id', async () => {
      const inexistentId = 100000;

      const fetchedPayment = await service.getProduct(inexistentId) as Failure<string>;


      expect(fetchedPayment.isFailure()).toBeTruthy()
      expect(fetchedPayment.error).toBe(`Product with ID ${inexistentId} not found`)
    })

  });
});