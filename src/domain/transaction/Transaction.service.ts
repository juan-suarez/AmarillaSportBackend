import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { paymentService } from '../payment/payment.service';
import { TransactionDetailService } from './transaction-detail.service';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => paymentService))
    private readonly paymentService: paymentService,
    @Inject(forwardRef(() => TransactionDetailService))
    private readonly transactionDetailService: TransactionDetailService,
  ) {}

  // Métodos de servicio aquí
}
