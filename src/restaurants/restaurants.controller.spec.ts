import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { UserRole } from '../users/entities/user.entity.js';
import type { AuthenticatedRequest } from '../users/types/authenticated-request.js';
import { JwtAuthGuard } from '../users/jwt-auth.guard.js';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  const staffUser = {
    sub: 'staff-1',
    role: UserRole.STAFF,
  };

  const restaurantsServiceMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all restaurants', () => {
    const restaurants = [{ id: 'restaurant-1', name: 'The Golden Fork' }];
    restaurantsServiceMock.findAll.mockReturnValue(restaurants);

    const result = controller.findAll();
    expect(restaurantsServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      message: 'Restaurants retrieved successfully',
      data: restaurants,
    });
  });

  it('should return a restaurant by id', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };
    restaurantsServiceMock.findById.mockReturnValue(restaurant);

    const result = controller.findById('restaurant-1');
    expect(restaurantsServiceMock.findById).toHaveBeenCalledWith(
      'restaurant-1',
    );
    expect(result).toEqual({
      statusCode: 200,
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    });
  });

  it('should create a restaurant', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      name: 'La Piazza',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
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

    const request = { user: staffUser };

    restaurantsServiceMock.create.mockReturnValue(restaurant);

    const result = controller.create(
      createRestaurantDto,
      request as AuthenticatedRequest,
    );
    expect(restaurantsServiceMock.create).toHaveBeenCalledWith(
      createRestaurantDto,
      staffUser,
    );
    expect(result).toEqual({
      statusCode: 201,
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  });

  it('should update a restaurant', () => {
    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'The Golden Fork Updated',
    };

    const restaurant = {
      id: 'restaurant-1',
      name: 'The Golden Fork Updated',
      description: 'Modern European cuisine in a relaxed atmosphere.',
      cuisine: 'European',
      address: '12 Main Street',
      city: 'Johannesburg',
      rating: 4.7,
    };

    const request = { user: staffUser };

    restaurantsServiceMock.update.mockReturnValue(restaurant);

    const result = controller.update(
      'restaurant-1',
      updateRestaurantDto,
      request as AuthenticatedRequest,
    );
    expect(restaurantsServiceMock.update).toHaveBeenCalledWith(
      'restaurant-1',
      updateRestaurantDto,
      staffUser,
    );
    expect(result).toEqual({
      statusCode: 200,
      message: 'Restaurant updated successfully',
      data: restaurant,
    });
  });

  it('should remove a restaurant', () => {
    const request = { user: staffUser };

    restaurantsServiceMock.remove.mockReturnValue(undefined);

    const result = controller.remove(
      'restaurant-1',
      request as AuthenticatedRequest,
    );
    expect(restaurantsServiceMock.remove).toHaveBeenCalledWith(
      'restaurant-1',
      staffUser,
    );
    expect(result).toBeUndefined();
  });
});
