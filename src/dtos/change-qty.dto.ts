import { IsInt, IsOptional, Min } from 'class-validator';

export class ChangeQtyDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
