import { IsDate, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Transaction } from "src/domain/transaction/transaction.entity";

export class PaymentDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
  
    @IsObject()
    readonly transaction: Partial<Transaction>;

    @IsString()
    @IsNotEmpty()
    readonly paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    readonly status: string;

    @IsString()
    @IsNotEmpty()
    readonly bankTransactionNumber: string;
  
    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;

    @IsDate()
    @IsNotEmpty()
    readonly updateAt: Date;
  }