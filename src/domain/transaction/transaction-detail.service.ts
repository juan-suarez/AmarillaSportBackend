import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';

@Injectable()
export class TransactionDetailService {
  constructor(
    @InjectRepository(TransactionDetail)
    private readonly customerRepository: Repository<TransactionDetail>,
  ) {}

}
