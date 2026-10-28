import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';

@Injectable()
export class RestaurantsRepository {
  private readonly restaurants: Restaurant[] = [
    {
      id: 'restaurant-1',
      ownerId: 'user-2',
      name: 'The Golden Fork',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      description: 'Modern European cuisine in a relaxed atmosphere.',
      cuisine: 'European',
      address: '12 Main Street',
      city: 'Johannesburg',
      rating: 4.7,
    },
    {
      id: 'restaurant-2',
      ownerId: 'user-1',
      name: 'Casa Verde',
      imageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
      description: 'Fresh Italian dishes made with seasonal ingredients.',
      cuisine: 'Italian',
      address: '45 Oak Avenue',
      city: 'Cape Town',
      rating: 4.5,
    },
    {
      id: 'restaurant-3',
      ownerId: 'user-2',
      name: 'Sakura House',
      imageUrl:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
      description: 'Traditional Japanese cuisine with a modern touch.',
      cuisine: 'Japanese',
      address: '8 Market Road',
      city: 'Durban',
      rating: 4.8,
    },
    {
      id: 'restaurant-4',
      ownerId: 'user-1',
      name: 'The Coastal Table',
      imageUrl:
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      description:
        'Fresh seafood and coastal-inspired dishes with ocean views.',
      cuisine: 'Seafood',
      address: '22 Beach Road',
      city: 'Cape Town',
      rating: 4.6,
    },
    {
      id: 'restaurant-5',
      ownerId: 'user-2',
      name: 'Ubuntu Kitchen',
      imageUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description:
        'Traditional South African favourites with a contemporary twist.',
      cuisine: 'South African',
      address: '18 Vilakazi Street',
      city: 'Johannesburg',
      rating: 4.9,
    },
    {
      id: 'restaurant-6',
      ownerId: 'user-1',
      name: 'Spice Route',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      description:
        'Aromatic curries and authentic Indian dishes made with fresh spices.',
      cuisine: 'Indian',
      address: '31 Long Street',
      city: 'Cape Town',
      rating: 4.4,
    },
    {
      id: 'restaurant-7',
      ownerId: 'user-2',
      name: 'Mamma Mia Pizzeria',
      imageUrl:
        'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80',
      description:
        'Wood-fired pizzas topped with fresh ingredients and Italian cheeses.',
      cuisine: 'Italian',
      address: '56 Florida Road',
      city: 'Durban',
      rating: 4.3,
    },
    {
      id: 'restaurant-8',
      ownerId: 'user-1',
      name: 'Green Garden Bistro',
      imageUrl:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      description:
        'Wholesome plant-based meals made with seasonal local produce.',
      cuisine: 'Vegan',
      address: '14 7th Street',
      city: 'Johannesburg',
      rating: 4.6,
    },
    {
      id: 'restaurant-9',
      ownerId: 'user-2',
      name: 'Dragon Wok',
      imageUrl:
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
      description:
        'Chinese-inspired stir-fries, noodles, and freshly prepared dumplings.',
      cuisine: 'Chinese',
      address: '27 Grey Street',
      city: 'Durban',
      rating: 4.2,
    },
    {
      id: 'restaurant-10',
      ownerId: 'user-1',
      name: 'The Breakfast Club',
      imageUrl:
        'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80',
      description:
        'All-day breakfasts, artisan coffee, and freshly baked pastries.',
      cuisine: 'Breakfast',
      address: '9 Kloof Street',
      city: 'Cape Town',
      rating: 4.5,
    },
  ];

  findAll() {
    return this.restaurants;
  }

  findById(id: string) {
    return this.restaurants.find((r) => r.id === id);
  }

  create(
    createRestaurantDto: CreateRestaurantDto,
    ownerId: string,
  ): Restaurant {
    const restaurant: Restaurant = {
      id: `restaurant-${this.restaurants.length + 1}`,
      ...createRestaurantDto,
      ownerId,
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

  remove(id: string): boolean {
    const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);

    if (restaurantIndex === -1) {
      return false;
    }

    this.restaurants.splice(restaurantIndex, 1);

    return true;
  }
}
