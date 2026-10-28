import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { MenuRepository } from './menu.repository.js';
import { UserRole } from '../users/entities/user.entity.js';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const adminUser = {
    sub: 'admin-1',
    role: UserRole.ADMIN,
  };

  const staffUser = {
    sub: 'staff-1',
    role: UserRole.STAFF,
  };

  const unauthorizedUser = {
    sub: 'customer-1',
    role: UserRole.CUSTOMER,
  };

  const restaurantsRepositoryMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const menuRepositoryMock = {
    findMenuByRestaurantId: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: RestaurantsRepository, useValue: restaurantsRepositoryMock },
        { provide: MenuRepository, useValue: menuRepositoryMock },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all restaurants', () => {
    const restaurants = [{ id: 'restaurant-1', name: 'The Golden Fork' }];
    restaurantsRepositoryMock.findAll.mockReturnValue(restaurants);

    const result = service.findAll();
    expect(result).toEqual(restaurants);
  });

  it('should return a restaurant by id', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };
    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);

    const result = service.findById('restaurant-1');
    expect(result).toEqual(restaurant);
  });

  it('should throw NotFoundException when a restaurant does not exist', () => {
    restaurantsRepositoryMock.findById.mockReturnValue(undefined);

    expect(() => {
      service.findById('does-not-exist');
    }).toThrow(NotFoundException);
  });

  it('should find a restaurant using the provided id', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };
    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);

    service.findById('restaurant-1');
    expect(restaurantsRepositoryMock.findById).toHaveBeenCalledWith(
      'restaurant-1',
    );
  });

  it('should create a restaurant', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      name: 'La Piazza',
      imageUrl: 'https://example.com/restaurant.jpg',
      description: 'Authentic Italian cuisine.',
      cuisine: 'Italian',
      address: '10 Church Street',
      city: 'Cape Town',
    };

    const restaurant = {
      id: 'restaurant-4',
      ...createRestaurantDto,
      ownerId: staffUser.sub,
      rating: 0,
    };

    restaurantsRepositoryMock.create.mockReturnValue(restaurant);

    const result = service.create(createRestaurantDto, staffUser);
    expect(restaurantsRepositoryMock.create).toHaveBeenCalledWith(
      createRestaurantDto,
      staffUser.sub,
    );
    expect(result).toEqual(restaurant);
  });

  it('should update a restaurant', () => {
    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'The Golden Fork Updated',
    };

    const existingRestaurant = {
      id: 'restaurant-1',
      name: 'The Golden Fork Updated',
      ownerId: staffUser.sub,
    };

    const updatedRestaurant = {
      ...existingRestaurant,
      ...updateRestaurantDto,
      description: 'Modern European cuisine in a relaxed atmosphere.',
      cuisine: 'European',
      address: '12 Main Street',
      city: 'Johannesburg',
      rating: 4.7,
    };

    restaurantsRepositoryMock.findById.mockReturnValue(existingRestaurant);
    restaurantsRepositoryMock.update.mockReturnValue(updatedRestaurant);

    const result = service.update(
      'restaurant-1',
      updateRestaurantDto,
      staffUser,
    );

    expect(restaurantsRepositoryMock.findById).toHaveBeenCalledWith(
      'restaurant-1',
    );
    expect(restaurantsRepositoryMock.update).toHaveBeenCalledWith(
      'restaurant-1',
      updateRestaurantDto,
    );
    expect(result).toEqual(updatedRestaurant);
  });

  it('should remove a restaurant', () => {
    const restaurant = {
      id: 'restaurant-1',
      name: 'The Golden Fork',
      ownerId: staffUser.sub,
    };

    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);

    service.remove('restaurant-1', staffUser);

    expect(restaurantsRepositoryMock.findById).toHaveBeenCalledWith(
      'restaurant-1',
    );
    expect(restaurantsRepositoryMock.remove).toHaveBeenCalledWith(
      'restaurant-1',
    );
  });

  it('should throw NotFoundException when removing a restaurant that does not exist', () => {
    restaurantsRepositoryMock.findById.mockReturnValue(undefined);

    expect(() => {
      service.remove('does-not-exist', adminUser);
    }).toThrow(NotFoundException);
    expect(restaurantsRepositoryMock.remove).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when updating a restaurant that does not exist', () => {
    restaurantsRepositoryMock.findById.mockReturnValue(undefined);

    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'Updated Name',
    };

    expect(() => {
      service.update('does-not-exist', updateRestaurantDto, adminUser);
    }).toThrow(NotFoundException);
    expect(restaurantsRepositoryMock.remove).not.toHaveBeenCalled();
  });

  it('should return a restaurant menu', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };
    const menu = {
      restaurantId: 'restaurant-1',
      categories: [
        {
          id: 'starters',
          name: 'Starters',
          items: [
            {
              id: 'gf-starter-1',
              name: 'Roasted Tomato Soup',
              description: 'Roasted tomatoes and fresh herbs.',
              price: 65,
              imageUrl: 'https://example.com/soup.jpg',
            },
          ],
        },
      ],
    };

    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);
    menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(menu);

    expect(service.findMenuByRestaurantId('restaurant-1')).toEqual(menu);
    expect(menuRepositoryMock.findMenuByRestaurantId).toHaveBeenCalledWith(
      'restaurant-1',
    );
  });

  it('should throw NotFoundException when the restaurant has no menu', () => {
    restaurantsRepositoryMock.findById.mockReturnValue({ id: 'restaurant-1' });
    menuRepositoryMock.findMenuByRestaurantId.mockReturnValue(undefined);

    expect(() => service.findMenuByRestaurantId('restaurant-1')).toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when the restaurant does not exist', () => {
    restaurantsRepositoryMock.findById.mockReturnValue(undefined);

    expect(() => service.findMenuByRestaurantId('unknown-restaurant')).toThrow(
      NotFoundException,
    );
    expect(menuRepositoryMock.findMenuByRestaurantId).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when an unauthorized user tries to create a restaurant', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      name: 'La Piazza',
      imageUrl: 'https://example.com/restaurant.jpg',
      description: 'Authentic Italian cuisine.',
      cuisine: 'Italian',
      address: '10 Church Street',
      city: 'Cape Town',
    };

    expect(() => {
      service.create(createRestaurantDto, unauthorizedUser);
    }).toThrow(ForbiddenException);
    expect(restaurantsRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should prevent staff from updating another staff members restaurant', () => {
    restaurantsRepositoryMock.findById.mockReturnValue({
      id: 'restaurant-1',
      ownerId: 'another-staff-1',
    });

    expect(() => {
      service.update('restaurant-1', { name: 'Updated Name' }, staffUser);
    }).toThrow(ForbiddenException);
    expect(restaurantsRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should allow admins to update any restaurant', () => {
    const restaurant = {
      id: 'restaurant-1',
      ownerId: 'another-staff-1',
    };

    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);
    restaurantsRepositoryMock.update.mockReturnValue({
      ...restaurant,
      name: 'Updated Name',
    });

    expect(
      service.update('restaurant-1', { name: 'Updated Name' }, adminUser),
    ).toEqual({ ...restaurant, name: 'Updated Name' });
    expect(restaurantsRepositoryMock.update).toHaveBeenCalled();
  });

  it('should throw ForbiddenException when an unauthorized user tries to remove a restaurant', () => {
    const restaurant = {
      id: 'restaurant-1',
      ownerId: 'another-staff-1',
    };

    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);

    expect(() => {
      service.remove('restaurant-1', unauthorizedUser);
    }).toThrow(ForbiddenException);
    expect(restaurantsRepositoryMock.remove).not.toHaveBeenCalled();
  });

  it('should prevent staff from removing another staff members restaurant', () => {
    restaurantsRepositoryMock.findById.mockReturnValue({
      id: 'restaurant-1',
      ownerId: 'another-staff-1',
    });

    expect(() => {
      service.remove('restaurant-1', staffUser);
    }).toThrow(ForbiddenException);
    expect(restaurantsRepositoryMock.remove).not.toHaveBeenCalled();
  });

  it('should allow admins to remove any restaurant', () => {
    restaurantsRepositoryMock.findById
      .mockReturnValueOnce({
        id: 'restaurant-1',
        ownerId: 'another-staff-1',
      })
      .mockReturnValueOnce({
        id: 'restaurant-2',
        ownerId: 'another-staff-1',
      });
    service.remove('restaurant-1', adminUser);
    service.remove('restaurant-2', adminUser);

    expect(restaurantsRepositoryMock.remove).toHaveBeenCalledTimes(2);
    expect(restaurantsRepositoryMock.remove).toHaveBeenCalledWith(
      'restaurant-1',
    );
    expect(restaurantsRepositoryMock.remove).toHaveBeenCalledWith(
      'restaurant-2',
    );
  });
});
