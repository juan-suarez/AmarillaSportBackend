import { Transaction } from './transaction.entity';
export declare class Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    transactions: Transaction[];
    created_at: Date;
}
