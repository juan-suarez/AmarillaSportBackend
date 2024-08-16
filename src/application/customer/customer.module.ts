import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { Product } from 'src/domain/product/product.entity';
import { Payment } from 'src/domain/payment/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Transaction,
      TransactionDetail,
      Product,
      Payment,
    ]),
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
