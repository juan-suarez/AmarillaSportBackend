import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from './Transaction.service';
import { Payment } from 'src/domain/entities/payment.entity';

@Injectable()
export class paymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly customerRepository: Repository<Payment>,
    @Inject(forwardRef(() => TransactionService)) 
    private readonly transactionService: TransactionService,
  ) {}

}
