import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from './product.entity';

@Entity()
export class TransactionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Transaction, transaction => transaction.details)
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(() => Product) // onUpdate can be used for a real-time price product update 
  @JoinColumn()
  product: Product;

  @CreateDateColumn()
  created_at: Date;

}
