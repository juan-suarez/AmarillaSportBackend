import { Injectable } from '@nestjs/common';
import { Customer } from 'src/domain/customer/customer.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { TransactionDetail } from '../transaction-details/transaction-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly customerService: CustomerService
  ) { }


  async createOrder(customer: Customer, transactionDetails : TransactionDetail[]): Promise<Result<Order,string>>{ //delete all dtos in domain layout
    const orderPayload = {
      transaction_details:transactionDetails,  
      customer,
    }
    const newOrder = this.orderRepository.create(orderPayload);
    try{
      return new Success( await this.orderRepository.save(newOrder));
    } catch(error) {
      console.error(error);
      return new Failure('Failed to create Order');
    }

  }

}
