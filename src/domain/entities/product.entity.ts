import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

}