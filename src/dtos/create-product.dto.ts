import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProduct {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
  @IsNotEmpty()
  @IsString()
  category: string;
}
