import { TransactionDetail } from './transaction-detail.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    detail: TransactionDetail;
    created_at: Date;
}
