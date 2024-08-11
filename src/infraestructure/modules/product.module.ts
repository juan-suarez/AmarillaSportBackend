import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction.module';
import { Product } from 'src/domain/entities/product.entity';
import { productService } from 'src/application/services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [productService],
  exports: [productService]
})
export class ProductModule {}