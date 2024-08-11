import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetailService } from 'src/domain/transaction/transaction-detail.service';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Product } from 'src/domain/product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionDetail,Product]),
  ],
  providers: [TransactionDetailService],
  exports: [TransactionDetailService],
})
export class TransactionDetailModule {}
