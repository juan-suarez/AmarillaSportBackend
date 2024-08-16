import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { TransactionDetail } from '../transaction-details/transaction-detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne((Type) => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(
    (Type) => TransactionDetail,
    (transactionDetail) => transactionDetail.order,
  )
  transaction_details: TransactionDetail[];
}
