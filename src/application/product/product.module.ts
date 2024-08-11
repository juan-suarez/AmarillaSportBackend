import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/domain/product/product.entity';
import { productService } from 'src/domain/product/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [productService],
  exports: [productService]
})
export class ProductModule {}