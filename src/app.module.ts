import { Module } from '@nestjs/common';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [RestaurantsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
