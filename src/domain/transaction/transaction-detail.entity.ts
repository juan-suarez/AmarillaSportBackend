import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../product/product.entity';

@Entity()
export class TransactionDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(Type => Transaction, transaction => transaction.detail, { cascade: true })
  @JoinColumn({name:'transaction_id'})
  transaction: Transaction;

  @OneToOne(Type => Product, product => product.detail) // onUpdate can be used for a real-time price product update
  @JoinColumn({name:'product_id'})
  product: Product;

  @CreateDateColumn()
  created_at: Date;
}
