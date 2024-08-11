import { Transaction } from './transaction.entity';
import { Product } from './product.entity';
export declare class TransactionDetails {
    id: number;
    quantity: number;
    transaction: Transaction;
    product: Product;
    created_at: Date;
}
