import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID } from "class-validator";
import { Customer } from "src/domain/customer/customer.entity";

export class TransactionDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
  
    @IsUUID()
    @IsNotEmpty()
    readonly transactionNumber: string;
  
    @IsNumber()
    @IsNotEmpty()
    readonly baseFee: number;
  
    @IsNumber()
    @IsNotEmpty()
    readonly deliveryFee: number;
  
    @IsNumber()
    @IsNotEmpty()
    readonly totalAmount: number;
  
    @IsString()
    @IsNotEmpty()
    status: string;
  
    @IsObject()
    readonly customer: Partial<Customer>;

  
    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;
  
    @IsDate()
    @IsNotEmpty()
    readonly updatedAt: Date;
  }