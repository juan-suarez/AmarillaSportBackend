import { Module, forwardRef } from '@nestjs/common';
import { Payment } from 'src/domain/payment/payment.entity';
import { paymentService } from 'src/domain/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment])
  ],
  providers: [paymentService],
  exports: [paymentService],
})
export class PaymentModule {}
