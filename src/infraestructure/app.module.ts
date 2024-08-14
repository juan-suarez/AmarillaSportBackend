import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/infraestructure/adapters/controllers/app.controller';
import { Customer } from 'src/domain/customer/customer.entity';
import { Payment } from 'src/domain/payment/payment.entity';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { AppService } from './app.service';
import { CustomerModule } from 'src/application/customer/customer.module';
import { TransactionModule } from 'src/application/transaction/transaction.module';
import { TransactionDetailModule } from 'src/application/transaction/transaction-details.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ProductModule } from 'src/application/product/product.module';
import { AuthController } from './adapters/controllers/auth/auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    //this must be refactored with a dataBase Module
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
    CustomerModule,
    TransactionModule,
    TransactionDetailModule,
    PaymentModule,
    ProductModule,
    JwtModule.register({
      global: true
    })
  ],
  controllers: [AppController, AuthController ],
  providers: [ AppService, AuthService ],
})
export class AppModule {}
