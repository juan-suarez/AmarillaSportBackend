import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(Type => Transaction, transaction => transaction.payment)
  @JoinColumn({name:'transaction_id'})
  transaction: Transaction;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 50 })
  status: string;

  @Column({ length: 255, nullable: true })
  bank_transaction_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
