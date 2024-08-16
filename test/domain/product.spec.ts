import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from 'src/domain/product/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/application/product/product.dto';
import * as bcrypt from 'bcrypt';
import { productService } from 'src/domain/product/product.service';
import { Success } from 'src/utils/result';
import { ProductDto } from 'src/domain/product/product.dto';

describe('productService', () => {
  let service: productService;
  let repository: Repository<Product>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        productService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<productService>(productService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, name: 'danna', description: 'Doe', stock: 20, price: 23123 },
      ];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.getProducts();
      if (result.isSuccess()) {
        expect(result.value).toEqual(products);
      }
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getProduct', () => {
    it('should return a product when found', async () => {
      const product = {
        id: 1,
        name: 'danna',
        description: 'Doe',
        stock: 20,
        price: 23123,
        transactions: [],
      };
      mockRepository.findOne.mockResolvedValue(product);

      const result = await service.getProduct(1);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          name: 'danna',
          description: 'Doe',
          stock: 20,
          price: 23123,
        });
      }
    });

    it('should return a failure when product is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getProduct(1);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Product with ID 1 not found');
      }
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'danna',
        description: 'Doe',
        stock: 20,
        price: 23123,
        image_url: '',
      };

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const createdProduct = { ...createProductDto, id: 1 };
      mockRepository.create.mockReturnValue(createdProduct);
      mockRepository.save.mockResolvedValue(createdProduct);

      const result = await service.createProduct(createProductDto);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          name: 'danna',
          description: 'Doe',
          stock: 20,
          price: 23123,
          imageUrl: '',
        });
      }
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...createProductDto,
        id: 1,
      });
    });

    it('should return a failure when creation fails', async () => {
      const createProductDto: CreateProductDto = {
        name: 'danna',
        description: 'Doe',
        stock: 20,
        price: 23123,
        image_url: '',
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createProduct(createProductDto);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create product');
      }
    });
  });
  // terminar esto **************
  describe('updateStock', () => {
    it('should update a product stock', async () => {
      const createProductDto: CreateProductDto = {
        name: 'danna',
        description: 'Doe',
        stock: 20,
        price: 23123,
        image_url: '',
      };

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const createdProduct = { ...createProductDto, id: 1 };
      mockRepository.create.mockReturnValue(createdProduct);
      mockRepository.save.mockResolvedValue(createdProduct);

      const result = await service.createProduct(createProductDto);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          name: 'danna',
          description: 'Doe',
          stock: 20,
          price: 23123,
          imageUrl: '',
        });
      }
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...createProductDto,
        id: 1,
      });
    });

    it('should return a failure when stock update fails', async () => {
      const createProductDto: CreateProductDto = {
        name: 'danna',
        description: 'Doe',
        stock: 20,
        price: 23123,
        image_url: '',
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createProduct(createProductDto);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create product');
      }
    });
  });
});
