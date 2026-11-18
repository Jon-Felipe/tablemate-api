export enum MenuType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  DESSERT = 'DESSERT',
  DRINKS = 'DRINKS',
  WINE = 'WINE',
}

export class RestaurantMenu {
  id: string;
  restaurantId: string;

  name: string;
  type: MenuType;

  description?: string;
  isActive: boolean;
}
