import { IsInt, Min } from 'class-validator';

export class ChangeQtyDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
