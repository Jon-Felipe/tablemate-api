import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// extras
import { MenusRepository } from './menus.repository.js';
import { RestaurantsRepository } from '../restaurants.repository.js';
import { CreateMenuItemDto } from './dto/create-menu.dto.js';
import { UserRole } from '../../users/entities/user.entity.js';

@Injectable()
export class MenusService {
  constructor(
    private readonly menuRepository: MenusRepository,
    private readonly restaurantsRepository: RestaurantsRepository,
  ) {}

  findMenuByRestaurantId(restaurantId: string) {
    const menu = this.menuRepository.findMenuByRestaurantId(restaurantId);

    if (!menu)
      throw new NotFoundException(
        `Menu for restaurant ${restaurantId} not found`,
      );

    return menu;
  }

  findMenuItemById(
    restaurantId: string,
    categoryId: string,
    menuItemId: string,
  ) {
    const menuItem = this.menuRepository.findMenuItemById(
      restaurantId,
      categoryId,
      menuItemId,
    );

    if (!menuItem)
      throw new NotFoundException(`Menu item with ID ${menuItemId} not found`);

    return menuItem;
  }

  createMenuItem(
    restaurantId: string,
    categoryId: string,
    createMenuItemDto: CreateMenuItemDto,
    user: { sub: string; role: string },
  ) {
    const restaurant = this.restaurantsRepository.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }

    if (
      user.role !== UserRole.ADMIN &&
      (user.role !== UserRole.STAFF || restaurant.ownerId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You are not allowed to add menu items to this restaurant',
      );
    }

    const menu = this.menuRepository.findMenuByRestaurantId(restaurantId);

    if (!menu) {
      throw new NotFoundException(
        `Menu for restaurant ${restaurantId} not found`,
      );
    }

    const category = menu.categories.find((c) => c.id === categoryId);

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.menuRepository.createMenuItem(
      restaurantId,
      categoryId,
      createMenuItemDto,
    );
  }
}
