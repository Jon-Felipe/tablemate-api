import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

// extras
import { MenusService } from './menus.service.js';
import { CreateMenuItemDto } from './dto/create-menu.dto.js';
import { JwtAuthGuard } from '../../users/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../../users/types/authenticated-request.js';
import { UpdateMenuItemDto } from './dto/update-menu.dto.js';

@Controller('restaurants/:restaurantId/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findMenuByRestaurantId(@Param('restaurantId') restaurantId: string) {
    const menu = this.menusService.findMenuByRestaurantId(restaurantId);

    return {
      statusCode: 200,
      message: 'Restaurant menu retrieved successfully',
      data: menu,
    };
  }

  @Get('categories/:categoryId/items/:menuItemId')
  findMenuItemById(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Param('menuItemId') menuItemId: string,
  ) {
    const menuItem = this.menusService.findMenuItemById(
      restaurantId,
      categoryId,
      menuItemId,
    );

    return {
      statusCode: 200,
      message: 'Menu Item retrieved successfully',
      data: menuItem,
    };
  }

  @Post('categories/:categoryId/items')
  @UseGuards(JwtAuthGuard)
  createMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const menuItem = this.menusService.createMenuItem(
      restaurantId,
      categoryId,
      createMenuItemDto,
      request.user,
    );

    return {
      statusCode: 201,
      message: 'Menu Item created successfully',
      data: menuItem,
    };
  }

  @Patch('categories/:categoryId/items/:menuItemId')
  @UseGuards(JwtAuthGuard)
  updateMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Param('menuItemId') menuItemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const menuItem = this.menusService.updateMenuItem(
      restaurantId,
      categoryId,
      menuItemId,
      updateMenuItemDto,
      request.user,
    );

    return {
      statusCode: 200,
      message: 'Menu Item updated successfully',
      data: menuItem,
    };
  }
}
