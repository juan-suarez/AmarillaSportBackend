import { Customer } from "../customer/customer.entity";
import { Payment } from "../payment/payment.entity";
import { TransactionDetail } from "../transaction-details/transaction-detail.entity";

export class TransactionDto {

  readonly id?: number;

  readonly transactionNumber: string;

  readonly baseFee: number;

  readonly deliveryFee: number;

  readonly totalAmount: number;

  readonly status: string;

  readonly customer?: Customer

  transactionDetails?: TransactionDetail[]

  payments?: Payment[]
}