import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetailService } from '../transaction/transaction-detail.service';

@Injectable()
export class productService {
  constructor(
    @InjectRepository(Product)
    private readonly customerRepository: Repository<Product>,
    @Inject(forwardRef(() => TransactionDetailService)) 
    private readonly transactionService: TransactionDetailService,
  ) {}

}
