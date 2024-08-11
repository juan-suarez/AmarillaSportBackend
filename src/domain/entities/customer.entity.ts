import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @OneToMany(() => Transaction, transaction => transaction.customer)
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

}