import { Transaction } from "../transaction/transaction.entity";

export class PaymentDto {

  readonly id?: number;

  readonly paymentMethod: string;

  readonly status: string;

  readonly bankTransactionNumber: string;

  readonly transaction?: Transaction;
}