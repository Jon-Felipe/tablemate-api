import { Injectable } from '@nestjs/common';

// extras
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { Restaurant } from './entities/restaurant.entity.js';
import { FindRestaurantQueryDto } from './dto/find-restaurant-query.dto.js';

@Injectable()
export class RestaurantsRepository {
  private readonly restaurantSeeds = [
    {
      id: 'restaurant-1',
      ownerId: 'user-2',
      name: 'The Golden Fork',
      description:
        'Modern European cuisine in a relaxed atmosphere, with a focus on seasonal ingredients. The menu changes regularly to highlight the freshest produce available. A perfect spot for both casual dining and special occasions. Local wines and craft cocktails complement the menu beautifully. Ideal for both lunch and dinner, with a welcoming ambiance for all guests.',
      cuisine: 'European',
      address: '12 Main Street',
      city: 'Johannesburg',
    },
    {
      id: 'restaurant-2',
      ownerId: 'user-1',
      name: 'Casa Verde',
      description: 'Fresh Italian dishes made with seasonal ingredients.',
      cuisine: 'Italian',
      address: '45 Oak Avenue',
      city: 'Cape Town',
    },
    {
      id: 'restaurant-3',
      ownerId: 'user-2',
      name: 'Sakura House',
      description: 'Traditional Japanese cuisine with a modern touch.',
      cuisine: 'Japanese',
      address: '8 Market Road',
      city: 'Durban',
    },
    {
      id: 'restaurant-4',
      ownerId: 'user-1',
      name: 'The Coastal Table',
      description:
        'Fresh seafood and coastal-inspired dishes with ocean views.',
      cuisine: 'Seafood',
      address: '22 Beach Road',
      city: 'Cape Town',
    },
    {
      id: 'restaurant-5',
      ownerId: 'user-2',
      name: 'Ubuntu Kitchen',
      description:
        'Traditional South African favourites with a contemporary twist.',
      cuisine: 'South African',
      address: '18 Vilakazi Street',
      city: 'Johannesburg',
    },
    {
      id: 'restaurant-6',
      ownerId: 'user-1',
      name: 'Spice Route',
      description:
        'Aromatic curries and authentic Indian dishes made with fresh spices.',
      cuisine: 'Indian',
      address: '31 Long Street',
      city: 'Cape Town',
    },
    {
      id: 'restaurant-7',
      ownerId: 'user-2',
      name: 'Mamma Mia Pizzeria',
      description:
        'Wood-fired pizzas topped with fresh ingredients and Italian cheeses.',
      cuisine: 'Italian',
      address: '56 Florida Road',
      city: 'Durban',
    },
    {
      id: 'restaurant-8',
      ownerId: 'user-1',
      name: 'Green Garden Bistro',
      description:
        'Wholesome plant-based meals made with seasonal local produce.',
      cuisine: 'Vegan',
      address: '14 7th Street',
      city: 'Johannesburg',
    },
    {
      id: 'restaurant-9',
      ownerId: 'user-2',
      name: 'Dragon Wok',
      description:
        'Chinese-inspired stir-fries, noodles, and freshly prepared dumplings.',
      cuisine: 'Chinese',
      address: '27 Grey Street',
      city: 'Durban',
    },
    {
      id: 'restaurant-10',
      ownerId: 'user-1',
      name: 'The Breakfast Club',
      description:
        'All-day breakfasts, artisan coffee, and freshly baked pastries.',
      cuisine: 'Breakfast',
      address: '9 Kloof Street',
      city: 'Cape Town',
    },
  ];

  private readonly restaurants: Restaurant[] = this.restaurantSeeds.map(
    (restaurant) => ({
      ...restaurant,
      slug: restaurant.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      priceLevel: 2,
      postalCode: '',
      country: 'South Africa',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      email: '',
      websiteUrl: '',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    }),
  );

  findAll(query: FindRestaurantQueryDto = new FindRestaurantQueryDto()) {
    const {
      search,
      city,
      cuisine,
      priceLevel,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;
    const normalizedSearch = search?.trim().toLowerCase();
    const normalizedCity = city?.trim().toLowerCase();
    const normalizedCuisine = cuisine?.trim().toLowerCase();

    const restaurants = this.restaurants.filter(
      (restaurant) =>
        (!normalizedSearch ||
          `${restaurant.name} ${restaurant.description}`
            .toLowerCase()
            .includes(normalizedSearch)) &&
        (!normalizedCity ||
          restaurant.city.toLowerCase() === normalizedCity) &&
        (!normalizedCuisine ||
          restaurant.cuisine.toLowerCase() === normalizedCuisine) &&
        (priceLevel === undefined || restaurant.priceLevel === priceLevel),
    );

    restaurants.sort((first, second) => {
      const firstValue = first[sortBy];
      const secondValue = second[sortBy];
      const comparison =
        typeof firstValue === 'number' && typeof secondValue === 'number'
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue));

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const offset = (page - 1) * limit;
    return restaurants.slice(offset, offset + limit);
  }

  findById(id: string) {
    return this.restaurants.find((r) => r.id === id);
  }

  create(
    createRestaurantDto: CreateRestaurantDto,
    ownerId: string,
  ): Restaurant {
    const nextId =
      Math.max(
        0,
        ...this.restaurants.map((restaurant) =>
          Number(restaurant.id.replace('restaurant-', '')),
        ),
      ) + 1;
    const now = new Date();
    const restaurant: Restaurant = {
      id: `restaurant-${nextId}`,
      ...createRestaurantDto,
      ownerId,
      slug: createRestaurantDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      createdAt: now,
      updatedAt: now,
    };

    this.restaurants.push(restaurant);
    return restaurant;
  }

  update(
    id: string,
    data: Partial<Omit<Restaurant, 'id' | 'ownerId' | 'createdAt'>>,
  ): Restaurant | undefined {
    const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);

    if (restaurantIndex === -1) {
      return undefined;
    }

    this.restaurants[restaurantIndex] = {
      ...this.restaurants[restaurantIndex],
      ...data,
      updatedAt: new Date(),
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
