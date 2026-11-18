export enum RestaurantInformationType {
  DRESS_CODE = 'DRESS_CODE',
  CORKAGE = 'CORKAGE',
  PARKING = 'PARKING',
  TRANSPORT = 'TRANSPORT',
  ACCESSIBILITY = 'ACCESSIBILITY',
  PAYMENT = 'PAYMENT',
  OTHER = 'OTHER',
}

export class RestaurantInformation {
  id: string;
  restaurantId: string;

  type: RestaurantInformationType;
  title: string;
  description: string;
  icon: string;

  displayOrder: number;
}
