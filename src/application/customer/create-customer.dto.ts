import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CustomerDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt
}
