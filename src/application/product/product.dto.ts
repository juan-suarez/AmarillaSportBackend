import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateProductDto {
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

  @IsString()
  @IsNotEmpty()
  readonly image_url: string;
}
