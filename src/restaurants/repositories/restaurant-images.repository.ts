import { Injectable } from '@nestjs/common';

import {
  type RestaurantImage,
  RestaurantImageType,
} from '../entities/restaurant-image.entity.js';

@Injectable()
export class RestaurantImagesRepository {
  private readonly restaurantImages: RestaurantImage[] = [
    {
      id: 'restaurant-image-1',
      restaurantId: 'restaurant-1',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      altText: 'Warmly lit dining room at The Golden Fork',
      caption: 'Our main dining room',
      type: RestaurantImageType.MAIN,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-2',
      restaurantId: 'restaurant-1',
      imageUrl:
        'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
      altText: 'A seasonal dish at The Golden Fork',
      caption: 'Seasonal ingredients, simply prepared',
      type: RestaurantImageType.FOOD,
      isPrimary: false,
      displayOrder: 2,
    },
    {
      id: 'restaurant-image-3',
      restaurantId: 'restaurant-2',
      imageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
      altText: 'An elegant table setting at Casa Verde',
      caption: 'Casa Verde dining room',
      type: RestaurantImageType.INTERIOR,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-4',
      restaurantId: 'restaurant-3',
      imageUrl:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sushi platter at Sakura House',
      caption: 'Freshly prepared sushi',
      type: RestaurantImageType.FOOD,
      isPrimary: true,
      displayOrder: 1,
    },
  ];

  findByRestaurantId(restaurantId: string): RestaurantImage[] {
    return this.restaurantImages
      .filter(
        (restaurantImage) => restaurantImage.restaurantId === restaurantId,
      )
      .sort((left, right) => left.displayOrder - right.displayOrder)
      .map((image) => ({ ...image }));
  }
}
