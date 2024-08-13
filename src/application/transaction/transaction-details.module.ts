import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { TransactionDetailService } from 'src/domain/transaction/transaction-detail.service';
import { Product } from 'src/domain/product/product.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionService } from 'src/domain/transaction/Transaction.service';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Customer } from 'src/domain/customer/customer.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, TransactionDetail, Product, Transaction]),
  ],
  providers: [TransactionDetailService,TransactionService, CustomerService],
  exports: [TransactionDetailService, TransactionService, CustomerService],
})
export class TransactionDetailModule {}
