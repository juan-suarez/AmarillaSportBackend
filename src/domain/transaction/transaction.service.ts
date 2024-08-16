import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { CustomerService } from '../customer/customer.service';
import { TransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject() private readonly customerService: CustomerService,
  ) {}

  async getTransaction(id: number): Promise<Result<TransactionDto, string>> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    console.log(transaction);
    if (!transaction) {
      return new Failure(`Transaction with ID ${id} not found`);
    }

    return new Success(this.mapToDto(transaction));
  }

  async createTransaction(
    transactionDto: TransactionDto,
    returnEntity: boolean = false,
  ): Promise<Result<TransactionDto | Transaction, string>> {
    try {
      const transaction = {
        transaction_number: transactionDto.transactionNumber,
        status: transactionDto.status,
        base_fee: transactionDto.baseFee,
        delivery_fee: transactionDto.deliveryFee,
        total_amount: transactionDto.totalAmount,
        customer: transactionDto.customer,
      };
      const newTransaction = this.transactionRepository.create(transaction);

      if (returnEntity) {
        return new Success(
          await this.transactionRepository.save(newTransaction),
        );
      }

      return new Success(
        this.mapToDto(await this.transactionRepository.save(newTransaction)),
      );
    } catch (error) {
      console.error(error);
      return new Failure('Failed to create Transaction');
    }
  }

  async updateTransactionStatus(
    transactionNumber: string,
    newStatus: string,
  ): Promise<Result<TransactionDto, string>> {
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_number: transactionNumber },
      relations: ['detail', 'detail.product', 'payment', 'customer'],
    });
    if (!transaction) {
      return new Failure('Transaction not found');
    }
    try {
      transaction.status = newStatus;
      return new Success(
        this.mapToDto(await this.transactionRepository.save(transaction)),
      );
    } catch (error) {
      return new Failure('Error updating transaction');
    }
  }

  async getTransactionByRef(ref: string) {
    const transaction = await this.transactionRepository.findOneBy({
      transaction_number: ref,
    });
    if (!transaction) {
      return new Failure(`Transaction with ref ${ref} not found`);
    }
    return new Success(transaction);
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
      transactionDetails: transaction.detail,
      payments: transaction.payment,
    };
  }
}
