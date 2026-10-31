import { Module } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository.js';

@Module({
  providers: [RestaurantsRepository],
  exports: [RestaurantsRepository],
})
export class RestaurantDataModule {}
