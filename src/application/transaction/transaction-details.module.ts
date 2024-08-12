import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { TransactionDetailService } from 'src/domain/transaction/transaction-detail.service';
import { Product } from 'src/domain/product/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionDetail,Product]), // Importar entidades usando TypeOrmModule
  ],
  providers: [TransactionDetailService],
  exports: [TransactionDetailService],
})
export class TransactionDetailModule {}
