import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/domain/entities/payment.entity';
import { TransactionModule } from './transaction.module';
import { paymentService } from 'src/application/services/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [paymentService],
  exports: [paymentService],
})
export class PaymentModule {}
