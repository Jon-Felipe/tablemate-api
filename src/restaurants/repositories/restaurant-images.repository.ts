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
    {
      id: 'restaurant-image-5',
      restaurantId: 'restaurant-4',
      imageUrl:
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      altText: 'Coastal dining room at The Coastal Table',
      caption: 'Dining by the coast',
      type: RestaurantImageType.MAIN,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-6',
      restaurantId: 'restaurant-5',
      imageUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      altText: 'Warm interior at Ubuntu Kitchen',
      caption: 'Welcome to Ubuntu Kitchen',
      type: RestaurantImageType.MAIN,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-7',
      restaurantId: 'restaurant-6',
      imageUrl:
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      altText: 'Spiced Indian dishes at Spice Route',
      caption: 'Flavours from the spice route',
      type: RestaurantImageType.FOOD,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-8',
      restaurantId: 'restaurant-7',
      imageUrl:
        'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80',
      altText: 'Wood-fired pizza at Mamma Mia Pizzeria',
      caption: 'Fresh from our wood-fired oven',
      type: RestaurantImageType.FOOD,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-9',
      restaurantId: 'restaurant-8',
      imageUrl:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      altText: 'Colourful plant-based dishes at Green Garden Bistro',
      caption: 'Fresh, wholesome, and plant-based',
      type: RestaurantImageType.FOOD,
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: 'restaurant-image-10',
      restaurantId: 'restaurant-1',
      imageUrl:
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      altText: 'Chef-plated dinner at The Golden Fork',
      caption: 'Thoughtfully prepared, from kitchen to table',
      type: RestaurantImageType.FOOD,
      isPrimary: false,
      displayOrder: 3,
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

  findPrimaryImageByRestaurantId(
    restaurantId: string,
  ): RestaurantImage | undefined {
    const images = this.restaurantImages
      .filter(
        (restaurantImage) =>
          restaurantImage.restaurantId === restaurantId &&
          restaurantImage.isPrimary,
      )
      .sort((left, right) => left.displayOrder - right.displayOrder);

    return images[0] ? { ...images[0] } : undefined;
  }
}
