import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @OneToMany((Type) => Transaction, (transaction) => transaction.customer)
  transactions: Transaction[];

  @OneToMany((Type) => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;
}
