import { Module } from '@nestjs/common';
// import { RestaurantsModule } from '../restaurants.module.js';
import { MenusRepository } from './menus.repository.js';
import { MenusService } from './menus.service.js';
import { RestaurantDataModule } from '../restaurant-data.module.js';
import { MenusController } from './menus.controller.js';
import { UsersModule } from '../../users/users.module.js';

@Module({
  imports: [RestaurantDataModule, UsersModule],
  controllers: [MenusController],
  providers: [MenusRepository, MenusService],
  exports: [MenusService],
})
export class MenusModule {}
