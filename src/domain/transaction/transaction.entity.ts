import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { TransactionDetail } from './transaction-detail.entity';
import { Payment } from '../payment/payment.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  transaction_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  delivery_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(Type => Customer, (customer) => customer.transactions, { cascade: true })
  @JoinColumn({ name: 'customer_id'})
  customer: Customer;

  @OneToMany(Type => TransactionDetail, transactionDetails => transactionDetails.transaction)
  detail: TransactionDetail[];

  @OneToOne(Type => Payment, (payment) => payment.transaction) // should be an OneToMany if we can retry the payment
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
