import { Injectable } from '@nestjs/common';
import type { RestaurantAward } from '../entities/restaurant-award.entity.js';

@Injectable()
export class RestaurantAwardsRepository {
  private readonly restaurantAwards: RestaurantAward[] = [
    {
      id: 'restaurant-award-1',
      restaurantId: 'restaurant-1',
      awardId: 'award-1',
      year: 2025,
      awardedAt: new Date('2025-06-15'),
    },
    {
      id: 'restaurant-award-2',
      restaurantId: 'restaurant-2',
      awardId: 'award-2',
      year: 2024,
      awardedAt: new Date('2024-09-01'),
    },
    {
      id: 'restaurant-award-3',
      restaurantId: 'restaurant-3',
      awardId: 'award-3',
      year: 2025,
      awardedAt: new Date('2025-03-20'),
    },
    {
      id: 'restaurant-award-4',
      restaurantId: 'restaurant-1',
      awardId: 'award-2',
      year: 2025,
      awardedAt: new Date('2025-05-10'),
    },
  ];

  findByRestaurantId(restaurantId: string): RestaurantAward[] {
    return this.restaurantAwards
      .filter(
        (restaurantAward) => restaurantAward.restaurantId === restaurantId,
      )
      .map((restaurantAward) => ({ ...restaurantAward }));
  }
}
