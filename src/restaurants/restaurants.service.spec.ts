import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// extras
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { UserRole } from '../users/entities/user.entity.js';
import { AwardsRepository } from './repositories/awards.repository.js';
import { RestaurantAwardsRepository } from './repositories/restaurant-awards.repository.js';
import { RestaurantFeaturesRepository } from './repositories/restaurant-features.repository.js';
import { RestaurantImagesRepository } from './repositories/restaurant-images.repository.js';
import { RestaurantInformationRepository } from './repositories/restaurant-information.repository.js';

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

  const restaurantImagesRepositoryMock = { findByRestaurantId: vi.fn() };
  const restaurantInformationRepositoryMock = { findByRestaurantId: vi.fn() };
  const restaurantFeaturesRepositoryMock = { findByRestaurantId: vi.fn() };
  const awardsRepositoryMock = { findById: vi.fn() };
  const restaurantAwardsRepositoryMock = { findByRestaurantId: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: RestaurantsRepository, useValue: restaurantsRepositoryMock },
        {
          provide: RestaurantImagesRepository,
          useValue: restaurantImagesRepositoryMock,
        },
        {
          provide: RestaurantInformationRepository,
          useValue: restaurantInformationRepositoryMock,
        },
        {
          provide: RestaurantFeaturesRepository,
          useValue: restaurantFeaturesRepositoryMock,
        },
        { provide: AwardsRepository, useValue: awardsRepositoryMock },
        {
          provide: RestaurantAwardsRepository,
          useValue: restaurantAwardsRepositoryMock,
        },
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

  it('should return all details for a restaurant', () => {
    const restaurant = { id: 'restaurant-1', name: 'The Golden Fork' };
    const images = [{ id: 'restaurant-image-1' }];
    const information = [{ id: 'restaurant-information-1' }];
    const features = [{ id: 'restaurant-feature-1' }];
    const restaurantAward = {
      id: 'restaurant-award-1',
      restaurantId: restaurant.id,
      awardId: 'award-1',
      year: 2025,
    };
    const award = { id: 'award-1', name: 'Best Fine Dining' };

    restaurantsRepositoryMock.findById.mockReturnValue(restaurant);
    restaurantImagesRepositoryMock.findByRestaurantId.mockReturnValue(images);
    restaurantInformationRepositoryMock.findByRestaurantId.mockReturnValue(
      information,
    );
    restaurantFeaturesRepositoryMock.findByRestaurantId.mockReturnValue(
      features,
    );
    restaurantAwardsRepositoryMock.findByRestaurantId.mockReturnValue([
      restaurantAward,
    ]);
    awardsRepositoryMock.findById.mockReturnValue(award);

    expect(service.findById(restaurant.id)).toEqual({
      ...restaurant,
      images,
      information,
      features,
      awards: [{ ...restaurantAward, award }],
    });
    expect(awardsRepositoryMock.findById).toHaveBeenCalledWith('award-1');
  });

  it('should throw NotFoundException when requesting details for a missing restaurant', () => {
    restaurantsRepositoryMock.findById.mockReturnValue(undefined);

    expect(() => service.findById('does-not-exist')).toThrow(NotFoundException);
    expect(
      restaurantImagesRepositoryMock.findByRestaurantId,
    ).not.toHaveBeenCalled();
  });

  it('should create a restaurant', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      name: 'La Piazza',
      description: 'Authentic Italian cuisine.',
      cuisine: 'Italian',
      priceLevel: 3,
      address: '10 Church Street',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa',
      latitude: -33.9249,
      longitude: 18.4241,
      phoneNumber: '+27 21 555 0100',
      email: 'hello@lapiazza.example',
      websiteUrl: 'https://lapiazza.example',
    };

    const restaurant = {
      id: 'restaurant-4',
      ...createRestaurantDto,
      ownerId: staffUser.sub,
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

  it('should throw ForbiddenException when an unauthorized user tries to create a restaurant', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      name: 'La Piazza',
      description: 'Authentic Italian cuisine.',
      cuisine: 'Italian',
      priceLevel: 3,
      address: '10 Church Street',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa',
      latitude: -33.9249,
      longitude: 18.4241,
      phoneNumber: '+27 21 555 0100',
      email: 'hello@lapiazza.example',
      websiteUrl: 'https://lapiazza.example',
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
