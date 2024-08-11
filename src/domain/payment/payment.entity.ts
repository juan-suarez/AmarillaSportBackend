import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Transaction, { onDelete: 'CASCADE' })
  @JoinColumn()
  transaction: Transaction;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 50 })
  payment_status: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @Column({ length: 255, nullable: true })
  bank_transaction_id: string;

  @Column({ length: 50, nullable: true })
  bank_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
