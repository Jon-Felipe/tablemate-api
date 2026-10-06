import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  findAll() {
    return this.restaurantsRepository.findAll();
  }

  findById(id: string) {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    return restaurant;
  }

  create(createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsRepository.create(createRestaurantDto);
  }

  update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = this.restaurantsRepository.update(
      id,
      updateRestaurantDto,
    );

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    return restaurant;
  }
}
