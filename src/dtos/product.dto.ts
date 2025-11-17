import { CategoryDto } from './category.dto';

export class ProductDto {
  title: string;
  id: string;
  price: number;
  description: string;
  images: string[];
  category: CategoryDto;
}
