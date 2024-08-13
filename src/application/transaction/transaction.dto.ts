import { Type } from "class-transformer";
import {  IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

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
  
    @IsNumber()
    @Type(()=> Number)
    readonly customerId: number;

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    readonly createdAt: Date;
  
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    readonly updatedAt: Date;
  }