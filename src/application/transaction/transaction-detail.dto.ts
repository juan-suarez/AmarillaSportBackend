import { IsDate, IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { Transaction } from "src/domain/transaction/transaction.entity";

export class TransactionDetailDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
  
    @IsObject()
    readonly transaction: Partial<Transaction>;
  
    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number;
  
    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;
  }