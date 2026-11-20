export enum RestaurantImageType {
  MAIN = 'MAIN',
  FOOD = 'FOOD',
  INTERIOR = 'INTERIOR',
  EXTERIOR = 'EXTERIOR',
  WINE = 'WINE',
  OTHER = 'OTHER',
}

export class RestaurantImage {
  id: string;
  restaurantId: string;

  imageUrl: string;
  altText: string;
  caption?: string;

  type: RestaurantImageType;
  isPrimary: boolean;
  displayOrder: number;
}
