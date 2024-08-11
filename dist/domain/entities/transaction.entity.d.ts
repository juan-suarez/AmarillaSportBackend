import { Customer } from './customer.entity';
import { TransactionDetail } from './transaction-detail.entity';
import { Payment } from './payment.entity';
export declare class Transaction {
    id: number;
    transaction_number: string;
    base_fee: number;
    delivery_fee: number;
    total_amount: number;
    status: string;
    customer: Customer;
    detail: TransactionDetail[];
    payment: Payment;
    created_at: Date;
    updated_at: Date;
}
