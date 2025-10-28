import { IsInt, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  externalId: string;

  @IsInt()
  @Min(1)
  quantity: number;
  @IsString()
  image: string;
}
