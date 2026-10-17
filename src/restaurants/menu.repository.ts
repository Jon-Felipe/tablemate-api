import { Injectable } from '@nestjs/common';

import { RestaurantMenu } from './entities/restaurant-menu.entity.js';

@Injectable()
export class MenuRepository {
  private readonly menus: RestaurantMenu[] = [
    {
      restaurantId: 'restaurant-1',
      categories: [
        {
          id: 'starters',
          name: 'Starters',
          items: [
            {
              id: 'gf-starter-1',
              name: 'Roasted Tomato Soup',
              description:
                'Slow-roasted tomatoes, fresh herbs, and crusty bread.',
              price: 65,
              imageUrl:
                'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'gf-starter-2',
              name: 'Crispy Calamari',
              description: 'Golden calamari with lemon and garlic aioli.',
              price: 95,
              imageUrl:
                'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
        {
          id: 'mains',
          name: 'Mains',
          items: [
            {
              id: 'gf-main-1',
              name: 'Grilled Beef Fillet',
              description:
                'Beef fillet with seasonal vegetables and herb butter.',
              price: 225,
              imageUrl:
                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'gf-main-2',
              name: 'Wild Mushroom Risotto',
              description: 'Creamy Arborio rice, wild mushrooms, and Parmesan.',
              price: 165,
              imageUrl:
                'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
      ],
    },
    {
      restaurantId: 'restaurant-2',
      categories: [
        {
          id: 'starters',
          name: 'Starters',
          items: [
            {
              id: 'cv-starter-1',
              name: 'Bruschetta',
              description: 'Toasted bread with tomato, basil, and olive oil.',
              price: 70,
              imageUrl:
                'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
        {
          id: 'mains',
          name: 'Mains',
          items: [
            {
              id: 'cv-main-1',
              name: 'Classic Margherita Pizza',
              description: 'Tomato, fresh mozzarella, and basil.',
              price: 135,
              imageUrl:
                'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'cv-main-2',
              name: 'Spaghetti Carbonara',
              description:
                'Spaghetti with a creamy egg sauce, Parmesan, and pancetta.',
              price: 155,
              imageUrl:
                'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
      ],
    },
    {
      restaurantId: 'restaurant-3',
      categories: [
        {
          id: 'starters',
          name: 'Starters',
          items: [
            {
              id: 'sh-starter-1',
              name: 'Edamame',
              description: 'Steamed soybeans finished with sea salt.',
              price: 55,
              imageUrl:
                'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
        {
          id: 'mains',
          name: 'Mains',
          items: [
            {
              id: 'sh-main-1',
              name: 'Salmon Sushi Platter',
              description: 'A selection of salmon nigiri and maki rolls.',
              price: 185,
              imageUrl:
                'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'sh-main-2',
              name: 'Chicken Ramen',
              description:
                'Japanese noodles in a rich broth with chicken and vegetables.',
              price: 145,
              imageUrl:
                'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
      ],
    },
  ];

  findMenuByRestaurantId(restaurantId: string): RestaurantMenu | undefined {
    return this.menus.find((m) => m.restaurantId === restaurantId);
  }
}
