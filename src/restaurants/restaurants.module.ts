import { Module } from '@nestjs/common';

import { RestaurantsRepository } from './restaurants.repository.js';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsController } from './restaurants.controller.js';
import { MenuRepository } from './menu.repository.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsRepository, MenuRepository, RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
