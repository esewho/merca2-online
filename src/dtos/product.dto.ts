import { CategoryDto } from './category.dto';

export class ProductDto {
  title: string;
  externalId: string;
  price: number;
  description: string;
  images: string[];
  category: CategoryDto;
}
