import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionDetail } from '../transaction/transaction-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

  @OneToOne(Type => TransactionDetail, transactionDetail => transactionDetail.product)
  @JoinColumn()
  detail: TransactionDetail

  @CreateDateColumn()
  created_at: Date;
}
