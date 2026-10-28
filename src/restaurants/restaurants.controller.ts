import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { JwtAuthGuard } from '../users/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../users/types/authenticated-request.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll() {
    const restaurants = this.restaurantsService.findAll();

    return {
      statusCode: 200,
      message: 'Restaurants retrieved successfully',
      data: restaurants,
    };
  }

  @Get(':id/menu')
  findMenuByRestaurantId(@Param('id') id: string) {
    const menu = this.restaurantsService.findMenuByRestaurantId(id);

    return {
      statusCode: 200,
      message: 'Restaurant menu retrieved successfully',
      data: menu,
    };
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const restaurant = this.restaurantsService.findById(id);

    return {
      statusCode: 200,
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const restaurant = this.restaurantsService.create(
      createRestaurantDto,
      request.user,
    );

    return {
      statusCode: 201,
      message: 'Restaurant created successfully',
      data: restaurant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const restaurant = this.restaurantsService.update(
      id,
      updateRestaurantDto,
      request.user,
    );

    return {
      statusCode: 200,
      message: 'Restaurant updated successfully',
      data: restaurant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.restaurantsService.remove(id, request.user);
  }
}
