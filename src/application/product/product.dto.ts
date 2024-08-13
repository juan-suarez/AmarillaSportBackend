import { IsDate, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { TransactionDetail } from "src/domain/transaction/transaction-detail.entity";

export class ProductDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsNumber()
    @IsNotEmpty()
    readonly stock: number;
  
    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;
  }