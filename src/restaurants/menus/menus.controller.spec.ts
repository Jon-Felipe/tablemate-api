import { Test, TestingModule } from '@nestjs/testing';

// extras
import { MenusController } from './menus.controller.js';
import { MenusService } from './menus.service.js';
import { JwtAuthGuard } from '../../users/jwt-auth.guard.js';
import { CreateMenuItemDto } from './dto/create-menu.dto.js';
import { UserRole } from '../../users/entities/user.entity.js';
import type { AuthenticatedRequest } from '../../users/types/authenticated-request.js';

describe('MenusController', () => {
  let controller: MenusController;

  const menusServiceMock = {
    findMenuByRestaurantId: vi.fn(),
    findMenuItemById: vi.fn(),
    createMenuItem: vi.fn(),
  };

  const createMenuItemDto: CreateMenuItemDto = {
    name: 'Test Menu Item',
    description: 'A test menu item for unit testing.',
    price: 9.99,
    imageUrl: 'https://example.com/test-menu-item.jpg',
  };

  const menu = {
    restaurantId: 'restaurant-1',
    categories: [
      {
        id: 'starters',
        name: 'Starters',
        items: [],
      },
    ],
  };

  const menuItem = {
    id: 'starters-123456',
    ...createMenuItemDto,
  };

  const request = {
    user: {
      sub: 'user-1',
      role: UserRole.STAFF,
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [{ provide: MenusService, useValue: menusServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMenuByRestaurantId', () => {
    it('should return a restaurant menu successfully', () => {
      menusServiceMock.findMenuByRestaurantId.mockReturnValue(menu);

      const result = controller.findMenuByRestaurantId('restaurant-1');

      expect(result).toEqual({
        statusCode: 200,
        message: 'Restaurant menu retrieved successfully',
        data: menu,
      });

      expect(menusServiceMock.findMenuByRestaurantId).toHaveBeenCalledWith(
        'restaurant-1',
      );
    });
  });

  describe('findMenuItemById', () => {
    it('should return a menu item successfully', () => {
      menusServiceMock.findMenuItemById.mockReturnValue(menuItem);

      const result = controller.findMenuItemById(
        'restaurant-1',
        'starters',
        'starters-123456',
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Menu Item retrieved successfully',
        data: menuItem,
      });

      expect(menusServiceMock.findMenuItemById).toHaveBeenCalledWith(
        'restaurant-1',
        'starters',
        'starters-123456',
      );
    });
  });

  describe('createMenuItem', () => {
    it('should create a menu item successfully', () => {
      menusServiceMock.createMenuItem.mockReturnValue(menuItem);

      const result = controller.createMenuItem(
        'restaurant-1',
        'starters',
        createMenuItemDto,
        request,
      );

      expect(result).toEqual({
        statusCode: 201,
        message: 'Menu Item created successfully',
        data: menuItem,
      });

      expect(menusServiceMock.createMenuItem).toHaveBeenCalledWith(
        'restaurant-1',
        'starters',
        createMenuItemDto,
        request.user,
      );
    });

    it('should pass the correct restaurant ID to the service', () => {
      menusServiceMock.createMenuItem.mockReturnValue(menuItem);

      controller.createMenuItem(
        'restaurant-2',
        'starters',
        createMenuItemDto,
        request,
      );

      expect(menusServiceMock.createMenuItem).toHaveBeenCalledWith(
        'restaurant-2',
        'starters',
        createMenuItemDto,
        request.user,
      );
    });

    it('should pass the correct category ID to the service', () => {
      menusServiceMock.createMenuItem.mockReturnValue(menuItem);

      controller.createMenuItem(
        'restaurant-1',
        'desserts',
        createMenuItemDto,
        request,
      );

      expect(menusServiceMock.createMenuItem).toHaveBeenCalledWith(
        'restaurant-1',
        'desserts',
        createMenuItemDto,
        request.user,
      );
    });
  });
});
