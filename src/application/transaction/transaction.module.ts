import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';
import { TransactionService } from 'src/domain/transaction/Transaction.service';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Customer } from 'src/domain/customer/customer.entity';
import { Payment } from 'src/domain/payment/payment.entity';
// Importa el módulo relacionado

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction,TransactionDetail,Customer, Payment]), 
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
