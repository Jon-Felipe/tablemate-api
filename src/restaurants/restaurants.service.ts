import { Injectable } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  findAll() {
    return this.restaurantsRepository.findAll();
  }

  findById(id: string) {
    return this.restaurantsRepository.findById(id);
  }
}
