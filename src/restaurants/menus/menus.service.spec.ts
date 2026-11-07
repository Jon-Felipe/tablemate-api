import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service.js';
import { MenusRepository } from './menus.repository.js';
import { RestaurantsRepository } from '../restaurants.repository.js';
import { CreateMenuItemDto } from './dto/create-menu.dto.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity.js';

describe('MenusService', () => {
  let service: MenusService;

  const menuRepositoryMock = {
    findMenuByRestaurantId: vi.fn(),
    findCategoryById: vi.fn(),
    findMenuItemById: vi.fn(),
    createMenuItem: vi.fn(),
  };

  const restaurantsServiceMock = {
    findById: vi.fn(),
  };

  const createMenuItemDto: CreateMenuItemDto = {
    name: 'Test Menu Item',
    description: 'A test menu item for unit testing.',
    price: 9.99,
    imageUrl: 'https://example.com/test-menu-item.jpg',
  };

  const restaurant = {
    id: 'restaurant-1',
    ownerId: 'user-1',
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

  const newMenuItem = {
    id: 'starters-123456',
    ...createMenuItemDto,
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        { provide: MenusRepository, useValue: menuRepositoryMock },
        { provide: RestaurantsRepository, useValue: restaurantsServiceMock },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMenuByRestaurantId', () => {
    it('should return a menu for a valid restaurant ID', () => {
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(menu);

      const result = service.findMenuByRestaurantId('restaurant-1');

      expect(result).toEqual(menu);
      expect(menuRepositoryMock.findMenuByRestaurantId).toHaveBeenCalledWith(
        'restaurant-1',
      );
    });

    it('should throw NotFoundException when the menu does not exist', () => {
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(undefined);

      expect(() => service.findMenuByRestaurantId('restaurant-1')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMenuItemById', () => {
    it('should return a menu item for valid IDs', () => {
      const menuItem = {
        id: 'menu-item-1',
        name: 'Test Menu Item',
        description: 'A test menu item for unit testing.',
        price: 9.99,
        imageUrl: 'https://example.com/test-menu-item.jpg',
      };
      menuRepositoryMock.findMenuItemById.mockReturnValue(menuItem);

      const result = service.findMenuItemById(
        'restaurant-1',
        'starters',
        'menu-item-1',
      );

      expect(result).toEqual(menuItem);
      expect(menuRepositoryMock.findMenuItemById).toHaveBeenCalledWith(
        'restaurant-1',
        'starters',
        'menu-item-1',
      );
    });

    it('should throw NotFoundException when the menu item does not exist', () => {
      menuRepositoryMock.findMenuItemById.mockReturnValue(undefined);

      expect(() =>
        service.findMenuItemById('restaurant-1', 'starters', 'menu-item-1'),
      ).toThrow(NotFoundException);
    });
  });

  describe('createMenuItem', () => {
    it('should create a menu item when the user is an admin', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(menu);
      menuRepositoryMock.findCategoryById.mockReturnValue(menu.categories[0]);
      menuRepositoryMock.createMenuItem.mockReturnValue(newMenuItem);

      const user = { sub: 'user-1', role: UserRole.ADMIN };
      const result = service.createMenuItem(
        'restaurant-1',
        'starters',
        createMenuItemDto,
        user,
      );

      expect(result).toEqual(newMenuItem);
      expect(restaurantsServiceMock.findById).toHaveBeenCalledWith(
        'restaurant-1',
      );
      expect(menuRepositoryMock.createMenuItem).toHaveBeenCalledWith(
        'restaurant-1',
        'starters',
        createMenuItemDto,
      );
    });

    it('should create a menu item when the user is the restaurant owner and has the STAFF role', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(menu);
      menuRepositoryMock.findCategoryById.mockReturnValue(menu.categories[0]);
      menuRepositoryMock.createMenuItem.mockReturnValue(newMenuItem);

      const user = { sub: 'user-1', role: UserRole.STAFF };
      const result = service.createMenuItem(
        'restaurant-1',
        'starters',
        createMenuItemDto,
        user,
      );

      expect(result).toEqual(newMenuItem);
      expect(menuRepositoryMock.createMenuItem).toHaveBeenCalledWith(
        'restaurant-1',
        'starters',
        createMenuItemDto,
      );
    });

    it('should throw NotFoundException when the restaurant does not exist', () => {
      restaurantsServiceMock.findById.mockReturnValue(undefined);

      const user = { sub: 'user-1', role: UserRole.ADMIN };

      expect(() =>
        service.createMenuItem(
          'restaurant-1',
          'starters',
          createMenuItemDto,
          user,
        ),
      ).toThrow(NotFoundException);
      expect(menuRepositoryMock.findMenuByRestaurantId).not.toHaveBeenCalled();
      expect(menuRepositoryMock.createMenuItem).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the user is not an admin or staff member', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);

      const user = { sub: 'user-1', role: UserRole.CUSTOMER };

      expect(() =>
        service.createMenuItem(
          'restaurant-1',
          'starters',
          createMenuItemDto,
          user,
        ),
      ).toThrow(ForbiddenException);
      expect(menuRepositoryMock.createMenuItem).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the user is a staff member but not the restaurant owner', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);

      const user = { sub: 'user-2', role: UserRole.STAFF };

      expect(() =>
        service.createMenuItem(
          'restaurant-1',
          'starters',
          createMenuItemDto,
          user,
        ),
      ).toThrow(ForbiddenException);
      expect(menuRepositoryMock.createMenuItem).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the restaurant menu does not exist', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(undefined);

      const user = { sub: 'user-1', role: UserRole.ADMIN };

      expect(() =>
        service.createMenuItem(
          'restaurant-1',
          'starters',
          createMenuItemDto,
          user,
        ),
      ).toThrow(NotFoundException);
      expect(menuRepositoryMock.createMenuItem).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the category does not exist', () => {
      restaurantsServiceMock.findById.mockReturnValue(restaurant);
      menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(menu);
      menuRepositoryMock.findCategoryById.mockReturnValue(undefined);

      const user = { sub: 'user-1', role: UserRole.ADMIN };

      expect(() =>
        service.createMenuItem(
          'restaurant-1',
          'invalid-category',
          createMenuItemDto,
          user,
        ),
      ).toThrow(NotFoundException);
      expect(menuRepositoryMock.createMenuItem).not.toHaveBeenCalled();
    });
  });
});
