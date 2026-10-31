import { Module } from '@nestjs/common';

import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsController } from './restaurants.controller.js';
import { UsersModule } from '../users/users.module.js';
import { MenusModule } from './menus/menus.module.js';
import { RestaurantDataModule } from './restaurant-data.module.js';

@Module({
  imports: [UsersModule, MenusModule, RestaurantDataModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
