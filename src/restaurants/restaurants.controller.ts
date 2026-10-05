import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }
}
