import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity.js';

@Injectable()
export class RestaurantsRepository {
  private readonly restaurants: Restaurant[] = [
    {
      id: 'restaurant-1',
      name: 'The Golden Fork',
      description: 'Modern European cuisine in a relaxed atmosphere.',
      cuisine: 'European',
      address: '12 Main Street',
      city: 'Johannesburg',
      rating: 4.7,
    },
    {
      id: 'restaurant-2',
      name: 'Casa Verde',
      description: 'Fresh Italian dishes made with seasonal ingredients.',
      cuisine: 'Italian',
      address: '45 Oak Avenue',
      city: 'Cape Town',
      rating: 4.5,
    },
    {
      id: 'restaurant-3',
      name: 'Sakura House',
      description: 'Traditional Japanese cuisine with a modern touch.',
      cuisine: 'Japanese',
      address: '8 Market Road',
      city: 'Durban',
      rating: 4.8,
    },
  ];

  findAll() {
    return this.restaurants;
  }

  findById(id: string) {
    return this.restaurants.find((r) => r.id === id);
  }
}
