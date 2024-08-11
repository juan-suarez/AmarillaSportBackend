import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction.module';
import { TransactionDetailService } from 'src/application/services/transaction-detail.service';
import { TransactionDetail } from 'src/domain/entities/transaction-detail.entity';
import { Product } from 'src/domain/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionDetail,Product]),
  ],
  providers: [TransactionDetailService],
  exports: [TransactionDetailService],
})
export class TransactionDetailModule {}
