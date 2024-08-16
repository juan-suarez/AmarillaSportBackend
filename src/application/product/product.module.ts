import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Product } from 'src/domain/product/product.entity';
import { productService } from 'src/domain/product/product.service';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { ProductsController } from 'src/infraestructure/adapters/controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      TransactionDetail,
      Transaction,
      Customer,
    ]),
  ],
  controllers: [ProductsController],
  providers: [productService],
  exports: [productService],
})
export class ProductModule {}
