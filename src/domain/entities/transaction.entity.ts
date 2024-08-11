import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { TransactionDetails } from './transaction-detail.entity';
import { Payment } from './payment.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
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

  @ManyToOne(() => Customer, customer => customer.transactions)
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => TransactionDetails, transactionDetails => transactionDetails.transaction)
  details: TransactionDetails[];

  @OneToOne(() => Payment, payment => payment.transaction) // should be an OneToMany if we can retry the payment
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
