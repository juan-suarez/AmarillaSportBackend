import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CustomerDto } from 'src/application/customer/create-customer.dto';
import { Failure, Result, Success } from 'src/utils/result';
import { TransactionDto } from 'src/application/transaction/transaction.dto';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/customer.entity';



@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @Inject() private readonly customerService: CustomerService
  ) { }

  async getTransaction(id: number): Promise<Result<TransactionDto, string>> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      return new Failure(`Transaction with ID ${id} not found`);
    }

    return new Success(this.mapToDto(transaction));

  }

  async createTransaction(transactionDto: TransactionDto): Promise<Result<Transaction, string>> {
    try {
      const transaction = {
        transaction_number: transactionDto.transactionNumber,
        status: transactionDto.status,
        base_fee:transactionDto.baseFee,
        delivery_fee: transactionDto.deliveryFee,
        total_amount: transactionDto.totalAmount,
        customer: transactionDto.customer,
      }
      const newTransaction = this.transactionRepository.create(transaction);

      return new Success( await this.transactionRepository.save(newTransaction));
    } catch (error) {
      console.log("error");
      return new Failure('Failed to create Transaction');
    }

  }
  async getTransactions():Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async getCustomers() {
    return await this.customerService.getCustomers()
  }

  private mapToDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      transactionNumber: transaction.transaction_number,
      status: transaction.status,
      baseFee: transaction.base_fee,
      deliveryFee: transaction.delivery_fee,
      totalAmount: transaction.total_amount,
      customer: transaction.customer,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    };
  }

}
