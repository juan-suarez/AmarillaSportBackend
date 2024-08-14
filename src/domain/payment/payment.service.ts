import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { Payment } from 'src/domain/payment/payment.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { PaymentDto } from 'src/application/payment/payment.dto';

@Injectable()
export class paymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject() private readonly transactionService: TransactionService 
  ) {}

  async getPayment(id: number): Promise<Result<PaymentDto, string>> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      return new Failure(`Payment with ID ${id} not found`);
    }

    return new Success(this.mapToDto(payment));

  }

  async createPayment( paymentDto: PaymentDto): Promise<Result<Payment, string>> {
    try {
      const payment = {
        transaction: paymentDto.transaction,
        payment_method: paymentDto.paymentMethod,
        status: paymentDto.status,
        bank_transaction_number: paymentDto.bankTransactionNumber
      }
      const newPayment = this.paymentRepository.create(payment);

      return new Success( await this.paymentRepository.save(newPayment));
    } catch (error) {
      console.log("error");
      return new Failure('Failed to create the payment');
    }

  }

  async updatePaymentStatus(payment: Payment, newStatus: string) {
    payment.status = newStatus;
    
    return new Success( this.paymentRepository.save(payment));
  }
  
  async getTransactions(){
    return await this.transactionService.getTransactions();
  }

  private mapToDto(payment: Payment): PaymentDto {
    return {
      transaction: payment.transaction,
      status: payment.status,
      bankTransactionNumber: payment.bank_transaction_number,
      paymentMethod: payment.payment_method,
    };
  }
}
