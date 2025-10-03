export class ProductDto {
  title: string;
  price: number;
  description: string;
  category: {
    name: string;
    image: string;
  };
}
