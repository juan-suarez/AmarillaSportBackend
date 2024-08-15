import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetailService } from '../transaction/transaction-detail.service';
import { Failure, Result, Success } from 'src/utils/result';
import { ProductDto } from 'src/application/product/product.dto';

@Injectable()
export class productService {
  constructor( 
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product> 
  ) {}

  async getProduct(id: number): Promise<Result<ProductDto, string>> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      return new Failure(`Product with ID ${id} not found`);
    }

    return new Success(this.mapToDto(product));

  }

  async createProduct( productDto: ProductDto): Promise<Result<Product, string>> {
    try {
      const product = {
        name: productDto.name,
        description: productDto.description,
        price: productDto.price,
        stock: productDto.stock,
        image_url: productDto.imageUrl
      }
      const newProduct = this.productRepository.create(product);
      return new Success( await this.productRepository.save(newProduct));
    } catch (error) {
      console.log("error");
      return new Failure('Failed to create the Product');
    }

  }

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductsByIds(productIds: number[]): Promise<Result<Product[],string>> {
    try {
      return new Success(await this.productRepository.find({ where: { id: In(productIds) } }));
      
    } catch (error) {
      return new Failure("Error Finding products")
    }
  }

  async updateStock(detailsInfo: any){
    const products = detailsInfo.map( detail => {
      detail.product.stock -= detail.quantity

      return detail.product
    })
    if(products.some(prodcut => prodcut.stock < 0)){
      return new Failure("Unavailable stock")
    }
    try {
      return new Success(await this.productRepository.save(products))
    } catch (error) {
      return new Failure("Failed to update stock")
    }
  }

  private mapToDto(product: Product): ProductDto {
    return {
      name:product.name,
      description:product.description,
      price: +product.price,
      stock: product.stock,
      imageUrl: product.image_url
    };
  }

}
