import { IsDate, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Transaction } from "src/domain/transaction/transaction.entity";

export class PaymentDto {
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
  }