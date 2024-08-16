import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from 'src/domain/product/product.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { ProductDto, ShoppingCartInfo } from './product.dto';
import { CreateProductDto } from 'src/application/product/product.dto';

@Injectable()
export class productService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProduct(id: number): Promise<Result<ProductDto, string>> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      return new Failure(`Product with ID ${id} not found`);
    }

    return new Success(this.mapToDto(product));
  }

  async createProduct(
    product: CreateProductDto,
  ): Promise<Result<ProductDto, string>> {
    try {
      const newProduct = this.productRepository.create(product);

      return new Success(
        this.mapToDto(await this.productRepository.save(newProduct)),
      );
    } catch (error) {
      console.error('error');
      return new Failure('Failed to create product');
    }
  }

  async getProducts(): Promise<Result<ProductDto[], string>> {
    try {
      return new Success(
        (await this.productRepository.find()).map(this.mapToDto),
      );
    } catch (error) {
      return new Failure('Error Finding products');
    }
  }

  async findProductsByIds(
    productIds: number[],
    returnEntity: boolean = false,
  ): Promise<Result<ProductDto[] | Product[], string>> {
    try {
      if (returnEntity) {
        return new Success(
          await this.productRepository.find({ where: { id: In(productIds) } }),
        );
      }
      return new Success(
        (
          await this.productRepository.find({ where: { id: In(productIds) } })
        ).map(this.mapToDto),
      );
    } catch (error) {
      return new Failure('Error Finding products');
    }
  }

  async updateStock(
    shoppingCartInfo: ShoppingCartInfo[],
  ): Promise<Result<ProductDto[], string>> {
    const products = shoppingCartInfo.map((detail) => {
      detail.product.stock -= detail.quantity;

      return detail.product;
    });
    if (products.some((prodcut) => prodcut.stock < 0)) {
      return new Failure('Unavailable stock');
    }
    try {
      return new Success(
        (await this.productRepository.save(products)).map(this.mapToDto),
      );
    } catch (error) {
      return new Failure('Failed to update stock');
    }
  }

  private mapToDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: +product.price,
      stock: product.stock,
      imageUrl: product.image_url,
      transactionDetails: product.detail,
    };
  }
}
