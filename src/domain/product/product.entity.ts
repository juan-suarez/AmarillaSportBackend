import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TransactionDetail } from '../transaction-details/transaction-detail.entity';

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

  @OneToMany(Type => TransactionDetail, transactionDetail => transactionDetail.product )
  detail: TransactionDetail

  @Column('text', {nullable:true})
  image_url: string;

  @CreateDateColumn()
  created_at: Date;
}
