import { Transaction } from './transaction.entity';
export declare class Payment {
    id: number;
    transaction: Transaction;
    payment_method: string;
    payment_status: string;
    payment_date: Date;
    bank_transaction_id: string;
    bank_status: string;
    created_at: Date;
    updated_at: Date;
}
