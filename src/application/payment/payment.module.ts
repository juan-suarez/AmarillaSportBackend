import { Module } from '@nestjs/common';
import { Payment } from 'src/domain/payment/payment.entity';
import { paymentService } from 'src/domain/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Customer } from 'src/domain/customer/customer.entity';
import { CustomerService } from 'src/domain/customer/customer.service';
import { TransactionService } from 'src/domain/transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Transaction, Customer])
  ],
  providers: [paymentService, TransactionService, CustomerService],
  exports: [paymentService, TransactionService, CustomerService],
})
export class PaymentModule {}
