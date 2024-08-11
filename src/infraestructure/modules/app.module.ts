import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/adapters/controllers/app.controller';
import { AppService } from 'src/application/services/app.service';
import { Customer } from 'src/domain/entities/customer.entity';
import { Payment } from 'src/domain/entities/payment.entity';
import { Product } from 'src/domain/entities/product.entity';
import { TransactionDetail } from 'src/domain/entities/transaction-detail.entity';
import { Transaction } from 'src/domain/entities/transaction.entity';

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
