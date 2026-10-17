import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

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
    }).compile();

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
      rating: 0,
    };

    restaurantsServiceMock.create.mockReturnValue(restaurant);

    const result = controller.create(createRestaurantDto);
    expect(restaurantsServiceMock.create).toHaveBeenCalledWith(
      createRestaurantDto,
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

    restaurantsServiceMock.update.mockReturnValue(restaurant);

    const result = controller.update('restaurant-1', updateRestaurantDto);
    expect(restaurantsServiceMock.update).toHaveBeenCalledWith(
      'restaurant-1',
      updateRestaurantDto,
    );
    expect(result).toEqual({
      statusCode: 200,
      message: 'Restaurant updated successfully',
      data: restaurant,
    });
  });

  it('should remove a restaurant', () => {
    restaurantsServiceMock.remove.mockReturnValue(undefined);

    const result = controller.remove('restaurant-1');
    expect(restaurantsServiceMock.remove).toHaveBeenCalledWith('restaurant-1');
    expect(result).toBeUndefined();
  });
});
