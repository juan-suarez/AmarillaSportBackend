import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/adapters/controllers/app.controller';
import { Customer } from 'src/domain/customer/customer.entity';
import { Payment } from 'src/domain/payment/payment.entity';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'app',
      entities:[Customer, Product, Transaction, TransactionDetail, Payment],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
