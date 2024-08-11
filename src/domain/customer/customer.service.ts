import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Repository } from 'typeorm';
import { TransactionService } from '../transaction/Transaction.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @Inject(forwardRef(() => TransactionService)) 
    private readonly transactionService: TransactionService,
  ) {}

}
