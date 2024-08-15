import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';

@Entity()
export class TransactionDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(Type => Transaction, transaction => transaction.detail, { cascade: true })
  @JoinColumn({name:'transaction_id'})
  transaction: Transaction;

  @ManyToOne(Type => Product, product => product.detail) // onUpdate can be used for a real-time price product update
  @JoinColumn({name:'product_id'})
  product: Product;

  @ManyToOne(Type => Order, order => order.transaction_details, { nullable: true })
  @JoinColumn({name:'Order_id'})
  order: Order;

  @CreateDateColumn()
  created_at: Date;
}
