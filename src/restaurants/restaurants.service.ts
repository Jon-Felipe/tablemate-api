import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { MenuRepository } from './menu.repository.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly menuRepository: MenuRepository,
  ) {}

  findAll() {
    return this.restaurantsRepository.findAll();
  }

  findById(id: string) {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    return restaurant;
  }

  create(
    createRestaurantDto: CreateRestaurantDto,
    user: { sub: string; role: string },
  ) {
    if (user.role !== UserRole.STAFF && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to create restaurants');
    }

    const ownerId = user.sub;

    return this.restaurantsRepository.create(createRestaurantDto, ownerId);
  }

  update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    user: { sub: string; role: string },
  ) {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    if (
      user.role !== UserRole.ADMIN &&
      (user.role !== UserRole.STAFF || restaurant.ownerId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this restaurant',
      );
    }

    return this.restaurantsRepository.update(id, updateRestaurantDto);
  }

  remove(id: string, user: { sub: string; role: string }): void {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    if (
      user.role !== UserRole.ADMIN &&
      (user.role !== UserRole.STAFF || restaurant.ownerId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this restaurant',
      );
    }

    this.restaurantsRepository.remove(id);
  }

  findMenuByRestaurantId(restaurantId: string) {
    this.findById(restaurantId);

    const menu = this.menuRepository.findMenuByRestaurantId(restaurantId);

    if (!menu)
      throw new NotFoundException(
        `Menu for restaurant ${restaurantId} not found`,
      );

    return menu;
  }
}
