import { Customer } from "../customer/customer.entity";
import { Order } from "../order/order.entity";
import { Payment } from "../payment/payment.entity";
import { Product } from "../product/product.entity";
import { TransactionDetail } from "../transaction-details/transaction-detail.entity";
import { Transaction } from "../transaction/transaction.entity";

export class TransactionDetailDto {

  readonly id?: number;

  readonly quantity: number;

  transaction ? : Transaction;

  product? : Product;

  order? : Order;
}