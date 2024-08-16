import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { Payment } from 'src/domain/payment/payment.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { PaymentDto } from './payment.dto';

@Injectable()
export class paymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getPayment(id: number): Promise<Result<PaymentDto, string>> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      return new Failure(`Payment with ID ${id} not found`);
    }

    return new Success(this.mapToDto(payment));
  }

  async createPayment(payment): Promise<Result<PaymentDto, string>> {
    try {
      const paymentPayload = {
        transaction: payment.transaction,
        payment_method: payment.paymentMethod,
        status: payment.status,
        bank_transaction_number: payment.bankTransactionNumber,
      };
      const newPayment = this.paymentRepository.create(paymentPayload);

      return new Success(
        this.mapToDto(await this.paymentRepository.save(newPayment)),
      );
    } catch (error) {
      console.error('error');
      return new Failure('Failed to create payment');
    }
  }

  async updatePaymentStatus(
    payment: Payment,
    newStatus: string,
  ): Promise<Result<PaymentDto, string>> {
    payment.status = newStatus;

    try {
      return new Success(
        this.mapToDto(await this.paymentRepository.save(payment)),
      );
    } catch (error) {
      return new Failure('Error updating payment status');
    }
  }

  private mapToDto(payment: Payment): PaymentDto {
    return {
      id: payment.id,
      transaction: payment.transaction,
      status: payment.status,
      bankTransactionNumber: payment.bank_transaction_number,
      paymentMethod: payment.payment_method,
    };
  }
}
