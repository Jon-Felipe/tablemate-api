import { Injectable } from '@nestjs/common';

import {
  type RestaurantInformation,
  RestaurantInformationType,
} from '../entities/restaurant-information.entity.js';

@Injectable()
export class RestaurantInformationRepository {
  private readonly restaurantInformation: RestaurantInformation[] = [
    {
      id: 'restaurant-information-1',
      restaurantId: 'restaurant-1',
      type: RestaurantInformationType.DRESS_CODE,
      title: 'Dress code',
      description: 'Smart casual attire is recommended.',
      icon: 'shirt',
      displayOrder: 1,
    },
    {
      id: 'restaurant-information-2',
      restaurantId: 'restaurant-1',
      type: RestaurantInformationType.PARKING,
      title: 'Parking',
      description: 'Complimentary street parking is available after 18:00.',
      icon: 'parking',
      displayOrder: 2,
    },
    {
      id: 'restaurant-information-3',
      restaurantId: 'restaurant-2',
      type: RestaurantInformationType.CORKAGE,
      title: 'Corkage',
      description: 'Guests may bring one bottle for a R100 corkage fee.',
      icon: 'wine',
      displayOrder: 1,
    },
    {
      id: 'restaurant-information-4',
      restaurantId: 'restaurant-3',
      type: RestaurantInformationType.ACCESSIBILITY,
      title: 'Accessibility',
      description:
        'Step-free entrance and an accessible restroom are available.',
      icon: 'accessibility',
      displayOrder: 1,
    },
  ];

  findByRestaurantId(restaurantId: string): RestaurantInformation[] {
    return this.restaurantInformation
      .filter((information) => information.restaurantId === restaurantId)
      .sort((left, right) => left.displayOrder - right.displayOrder)
      .map((information) => ({ ...information }));
  }
}
