import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';

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

  create(createRestaurantDto: CreateRestaurantDto): Restaurant {
    const restaurant: Restaurant = {
      id: `restaurant-${this.restaurants.length + 1}`,
      ...createRestaurantDto,
      rating: 0,
    };

    this.restaurants.push(restaurant);

    return restaurant;
  }

  update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Restaurant | undefined {
    const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);

    if (restaurantIndex === -1) {
      return undefined;
    }

    this.restaurants[restaurantIndex] = {
      ...this.restaurants[restaurantIndex],
      ...updateRestaurantDto,
    };

    return this.restaurants[restaurantIndex];
  }
}
