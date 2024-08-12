import { Module } from '@nestjs/common';
import { TransactionService } from 'src/domain/transaction/Transaction.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Payment } from 'src/domain/payment/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from 'src/domain/customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction,Customer,TransactionDetail, Payment]),
  ],
  providers: [TransactionService, CustomerService],
  exports: [TransactionService, CustomerService],
})
export class TransactionModule {}
