import { Injectable } from '@nestjs/common';
import type { RestaurantFeature } from '../entities/restaurant-feature.entity.js';

@Injectable()
export class RestaurantFeaturesRepository {
  private readonly restaurantFeatures: RestaurantFeature[] = [
    {
      id: 'restaurant-feature-1',
      restaurantId: 'restaurant-1',
      title: 'Chef-led tasting menu',
      description: 'A seasonal tasting menu prepared by our head chef.',
      icon: 'chef-hat',
      displayOrder: 1,
    },
    {
      id: 'restaurant-feature-2',
      restaurantId: 'restaurant-1',
      title: 'Private dining',
      description: 'An intimate dining room available for special occasions.',
      icon: 'users',
      displayOrder: 2,
    },
    {
      id: 'restaurant-feature-3',
      restaurantId: 'restaurant-2',
      title: 'Locally sourced ingredients',
      description: 'Produce and ingredients supplied by nearby farms.',
      icon: 'leaf',
      displayOrder: 1,
    },
    {
      id: 'restaurant-feature-4',
      restaurantId: 'restaurant-3',
      title: 'Sushi counter',
      description: 'Watch our sushi chefs prepare each dish to order.',
      icon: 'utensils',
      displayOrder: 1,
    },
  ];

  findByRestaurantId(restaurantId: string): RestaurantFeature[] {
    return this.restaurantFeatures
      .filter(
        (restaurantFeature) => restaurantFeature.restaurantId === restaurantId,
      )
      .sort((left, right) => left.displayOrder - right.displayOrder)
      .map((feature) => ({ ...feature }));
  }
}
