import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from './Transaction.service';
import { TransactionDetail } from 'src/domain/entities/transaction-detail.entity';

@Injectable()
export class TransactionDetailService {
  constructor(
    @InjectRepository(TransactionDetail)
    private readonly customerRepository: Repository<TransactionDetail>,
    @Inject(forwardRef(() => TransactionService)) 
    private readonly transactionService: TransactionService,
  ) {}

}
