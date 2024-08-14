import { Type } from "class-transformer";
import {  IsDate, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID } from "class-validator";
import { Customer } from "src/domain/customer/customer.entity";

export class TransactionDto {
  
    @IsUUID()
    @IsNotEmpty()
    readonly transactionNumber: string;
  
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    readonly baseFee: number;
  
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    readonly deliveryFee: number;
  
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    readonly totalAmount: number;
  
    @IsString()
    @IsNotEmpty()
    status: string;
  
    @IsObject()
    readonly customer: Customer;

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    readonly createdAt: Date;
  
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    readonly updatedAt: Date;
  }