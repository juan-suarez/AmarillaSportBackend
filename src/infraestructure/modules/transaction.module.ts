import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';
import { CustomerModule } from './customer.module';
import { PaymentModule } from './payment.module';
import { TransactionDetailModule } from './transaction-details.module';
import { TransactionService } from 'src/application/services/Transaction.service';
import { TransactionDetail } from 'src/domain/entities/transaction-detail.entity';
import { Customer } from 'src/domain/entities/customer.entity';
import { Payment } from 'src/domain/entities/payment.entity';
// Importa el módulo relacionado

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction,TransactionDetail,Customer, Payment]), 
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
