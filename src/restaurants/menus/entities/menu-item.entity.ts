export class MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;

  price: number;
  currency: string;

  imageUrl?: string;

  isAvailable: boolean;
  displayOrder: number;
}
