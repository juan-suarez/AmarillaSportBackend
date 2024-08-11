import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/domain/payment/payment.entity';
import { paymentService } from 'src/domain/payment/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [paymentService],
  exports: [paymentService],
})
export class PaymentModule {}
