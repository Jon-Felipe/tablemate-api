import { Module } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository.js';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsController } from './restaurants.controller.js';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsRepository, RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
