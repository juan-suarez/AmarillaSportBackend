import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { TransactionDetailDto } from 'src/application/transaction/transaction-detail.dto';
import { TransactionService } from './transaction.service';
import { Product } from '../product/product.entity';
import { Transaction } from './transaction.entity';

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

  async createTransactionDetails(products: Product[], transaction: Transaction, quantities: number[]): Promise<Result<TransactionDetail[],string>> {
    const transactionDetailsPayload: TransactionDetail[] = products.map((product,index) => {
      const transactionDetail = new TransactionDetail()
      transactionDetail.quantity = quantities[index];
      transactionDetail.product = product;
      transactionDetail.transaction = transaction

      return transactionDetail
    });

    try {
      const transactionDetails = await this.transactionDetailRepository.create(transactionDetailsPayload) as TransactionDetail[]

      return new Success( await this.transactionDetailRepository.save(transactionDetails) );
    } catch (error) {
      console.log(error)
      return new Failure("Error creating transaction details")
    }

  }
  
  async getTransactions(){
    return await this.transactionService.getTransactions();
  }

  async getTransactionDetailsByTransactionId(transactionId){
    const transaction = await this.transactionService.getTransaction(transactionId)
    if(transaction.isFailure()){
      return new Failure("transaction not found")
    }
    try {
      const transactionDetails = await this.transactionDetailRepository.findBy({transaction: transaction.value})
      return new Success(transactionDetails)
    } catch (error) {
      
    }
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
