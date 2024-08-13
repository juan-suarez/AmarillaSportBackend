import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { TransactionService } from './Transaction.service';
import { Failure, Result, Success } from 'src/utils/result';
import { TransactionDetailDto } from 'src/application/transaction/transaction-detail.dto';

@Injectable()
export class TransactionDetailService {
  constructor(
    @InjectRepository(TransactionDetail) private readonly transactionDetailRepository: Repository<TransactionDetail>,
    @Inject() private readonly transactionService: TransactionService 
  ) {}

  async getTransactionDetail(id: number): Promise<Result<TransactionDetailDto, string>> {
    const transactionDetail = await this.transactionDetailRepository.findOne({ where: { id } });

    if (!transactionDetail) {
      return new Failure(`TransactionDetail with ID ${id} not found`);
    }

    return new Success(this.mapToDto(transactionDetail));

  }

  async createTransactionDetail({ transaction, quantity}: TransactionDetailDto): Promise<Result<TransactionDetail, string>> {
    try {
      const transactionDetail = {
        transaction,
        quantity 
      }
      const newTransactionDetail = this.transactionDetailRepository.create(transactionDetail);

      return new Success( await this.transactionDetailRepository.save(newTransactionDetail));
    } catch (error) {
      console.log("error");
      return new Failure('Failed to create TransactionDEtail');
    }

  }
  
  async getTransactions(){
    return await this.transactionService.getTransactions();
  }

  private mapToDto(transactionDetail: TransactionDetail): TransactionDetailDto {
    return {
      id: transactionDetail.id,
      transaction: transactionDetail.transaction,
      quantity: transactionDetail.quantity,
      createdAt: transactionDetail.created_at,
    };
  }
}
