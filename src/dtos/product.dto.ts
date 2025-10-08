export class ProductDto {
  title: string;
  externalId: string;
  price: number;
  description: string;
  image: string;
  category: {
    name: string;
    image: string;
  };
}
