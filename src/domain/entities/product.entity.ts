import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TransactionDetail } from './transaction-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock_quantity: number;

  @OneToMany(Type => TransactionDetail, TransactionDetail => TransactionDetail.product)
  detail: TransactionDetail

  @CreateDateColumn()
  created_at: Date;
}
