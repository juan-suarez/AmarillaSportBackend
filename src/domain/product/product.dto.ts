import { TransactionDetail } from '../transaction-details/transaction-detail.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Product } from './product.entity';

export class ProductDto {
  readonly id?: number;

  readonly name: string;

  readonly description: string;

  readonly price: number;

  stock: number;

  readonly imageUrl: string;

  readonly transactionDetails?: TransactionDetail;
}

export class ShoppingCartInfo {
  readonly quantity: number;

  readonly product: Product;
}
