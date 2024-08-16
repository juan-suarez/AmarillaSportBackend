import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { TransactionService } from '../transaction/transaction.service';
import { Product } from '../product/product.entity';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionDetailDto } from './transaction-detail.dto';

@Injectable()
export class TransactionDetailService {
  constructor(
    @InjectRepository(TransactionDetail)
    private readonly transactionDetailRepository: Repository<TransactionDetail>,
    @Inject() private readonly transactionService: TransactionService,
  ) {}

  async getTransactionDetail(
    id: number,
  ): Promise<Result<TransactionDetailDto, string>> {
    const transactionDetail = await this.transactionDetailRepository.findOne({
      where: { id },
    });

    if (!transactionDetail) {
      return new Failure(`TransactionDetail with ID ${id} not found`);
    }

    return new Success(this.mapToDto(transactionDetail));
  }

  async createTransactionDetail({
    transaction,
    quantity,
  }: TransactionDetailDto): Promise<Result<TransactionDetail, string>> {
    try {
      const transactionDetail = {
        transaction,
        quantity,
      };
      const newTransactionDetail =
        this.transactionDetailRepository.create(transactionDetail);

      return new Success(
        await this.transactionDetailRepository.save(newTransactionDetail),
      );
    } catch (error) {
      console.error(error);
      return new Failure('Failed to create TransactionDetail');
    }
  }

  async createTransactionDetails(
    products: Product[],
    transaction: Transaction,
    quantities: number[],
  ): Promise<Result<TransactionDetail[], string>> {
    const transactionDetailsPayload: TransactionDetail[] = products.map(
      (product, index) => {
        const transactionDetail = new TransactionDetail();
        transactionDetail.quantity = quantities[index];
        transactionDetail.product = product;
        transactionDetail.transaction = transaction;

        return transactionDetail;
      },
    );

    try {
      const transactionDetails = (await this.transactionDetailRepository.create(
        transactionDetailsPayload,
      )) as TransactionDetail[];

      return new Success(
        await this.transactionDetailRepository.save(transactionDetails),
      );
    } catch (error) {
      console.error(error);
      return new Failure('Error creating transaction details');
    }
  }

  private mapToDto(transactionDetail: TransactionDetail): TransactionDetailDto {
    return {
      id: transactionDetail.id,
      quantity: transactionDetail.quantity,
      transaction: transactionDetail.transaction,
      order: transactionDetail.order,
      product: transactionDetail.product,
    };
  }
}
