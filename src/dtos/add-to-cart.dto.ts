import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  externalId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number | 1;
}
