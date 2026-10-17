import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { MenuRepository } from './menu.repository.js';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

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

    restaurantsRepositoryMock.create.mockReturnValue(restaurant);

    const result = service.create(createRestaurantDto);
    expect(restaurantsRepositoryMock.create).toHaveBeenCalledWith(
      createRestaurantDto,
    );
    expect(result).toEqual(restaurant);
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

    restaurantsRepositoryMock.update.mockReturnValue(restaurant);

    const result = service.update('restaurant-1', updateRestaurantDto);
    expect(restaurantsRepositoryMock.update).toHaveBeenCalledWith(
      'restaurant-1',
      updateRestaurantDto,
    );
    expect(result).toEqual(restaurant);
  });

  it('should remove a restaurant', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };

    restaurantsRepositoryMock.remove.mockReturnValue(restaurant);

    const result = service.remove('restaurant-1');
    expect(restaurantsRepositoryMock.remove).toHaveBeenCalledWith(
      'restaurant-1',
    );
    expect(result).toBeUndefined();
  });

  it('should throw NotFoundException when removing a restaurant that does not exist', () => {
    restaurantsRepositoryMock.remove.mockReturnValue(undefined);

    expect(() => {
      service.remove('does-not-exist');
    }).toThrow(NotFoundException);
  });

  it('should throw NotFoundException when updating a restaurant that does not exist', () => {
    restaurantsRepositoryMock.update.mockReturnValue(undefined);
    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'Updated Name',
    };

    expect(() => {
      service.update('does-not-exist', updateRestaurantDto);
    }).toThrow(NotFoundException);
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
});
