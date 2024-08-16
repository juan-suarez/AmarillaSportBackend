import { Module } from '@nestjs/common';
import { TransactionService } from 'src/domain/transaction/transaction.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Payment } from 'src/domain/payment/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from 'src/domain/customer/customer.service';
import { TransactionController } from 'src/infraestructure/adapters/controllers/transaction.controller';
import { TransactionOrchestrator } from './transaction.service';
import { BankService } from 'src/infraestructure/adapters/gateways/bank.service';
import { HttpModule } from '@nestjs/axios';
import { paymentService } from 'src/domain/payment/payment.service';
import { productService } from 'src/domain/product/product.service';
import { TransactionDetailService } from 'src/domain/transaction-details/transaction-detail.service';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { Order } from 'src/domain/order/order.entity';
import { OrderService } from 'src/domain/order/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Transaction,
      Payment,
      TransactionDetail,
      Product,
      Order,
    ]),
    HttpModule,
  ],
  providers: [
    TransactionService,
    CustomerService,
    TransactionOrchestrator,
    BankService,
    paymentService,
    productService,
    TransactionDetailService,
    OrderService,
  ],
  exports: [
    TransactionService,
    CustomerService,
    TransactionOrchestrator,
    BankService,
    paymentService,
    productService,
    TransactionDetailService,
    OrderService,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
