import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../product/product.entity';

@Entity()
export class TransactionDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(Type => Transaction, (transaction) => transaction.detail)
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(Type => Product, product => product.detail) // onUpdate can be used for a real-time price product update
  @JoinColumn()
  product: Product;

  @CreateDateColumn()
  created_at: Date;
}
