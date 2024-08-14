import { Type } from "class-transformer";
import {  IsArray, IsDate, IsNotEmpty, isNumber, IsNumber, IsObject, IsOptional, IsString, IsUUID } from "class-validator";
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
  }

  export class CardDetailsDto {
    @IsString()
    @IsNotEmpty()
    readonly number: string;
  
    @IsString()
    @IsNotEmpty()
    readonly cvc: string;
  
    @IsString()
    @IsNotEmpty()
    readonly exp_month: string;
  
    @IsString()
    @IsNotEmpty()
    readonly exp_year: string;
  
    @IsString()
    @IsNotEmpty()
    readonly card_holder: string;
  }
  
  export class shippingAddressDetailsDto{
    @IsString()
    @IsNotEmpty()
    readonly address_line_1: string;
  
    @IsString()
    @IsOptional()
    readonly address_line_2: string;
  
    @IsString()
    @IsNotEmpty()
    readonly country: string;
  
    @IsString()
    @IsNotEmpty()
    readonly region: string;
  
    @IsString()
    @IsNotEmpty()
    readonly city: string;
  
    @IsString()
    @IsOptional()
    readonly name: string;
  
    @IsString()
    @IsNotEmpty()
    readonly phone_number: string;
  
    @IsString()
    @IsOptional()
    readonly postal_code: string;
  
  }
 export class ShoppingCartProdcutsDto{
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
  readonly quantity: number;
 }
export class CreateTransactionDto {
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

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  readonly installments: number;
  
  @IsObject()
  @IsNotEmpty()
  readonly cardDetails: CardDetailsDto;

  @IsObject()
  @IsNotEmpty()
  readonly shippingAddressDetails: shippingAddressDetailsDto;

  @IsArray()
  @IsNotEmpty()
  readonly shoppingCartProdcuts: ShoppingCartProdcutsDto[] 
}
