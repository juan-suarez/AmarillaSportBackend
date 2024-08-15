import { Module } from '@nestjs/common';
import { Customer } from 'src/domain/customer/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Order } from 'src/domain/order/order.entity';
import { OrderService } from 'src/domain/order/order.service';
import { CustomerService } from 'src/domain/customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer,TransactionDetail, Order]),
  ],
  providers: [OrderService, CustomerService],
  exports: [OrderService],
})
export class OrderModule {}
