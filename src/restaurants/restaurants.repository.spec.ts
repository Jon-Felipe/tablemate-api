import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantsRepository } from './restaurants.repository.js';

describe('RestaurantsRepository', () => {
  let repository: RestaurantsRepository;

  beforeEach(() => {
    repository = new RestaurantsRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return all restaurants', () => {
    const result = repository.findAll();

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'restaurant-1',
          name: 'The Golden Fork',
        }),
        expect.objectContaining({
          id: 'restaurant-2',
          name: 'Casa Verde',
        }),
        expect.objectContaining({
          id: 'restaurant-3',
          name: 'Sakura House',
        }),
      ]),
    );
  });

  it('should return a restaurant by id', () => {
    const result = repository.findById('restaurant-1');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'restaurant-1',
        name: 'The Golden Fork',
      }),
    );
  });

  it('should return undefined when a restaurant does not exist', () => {
    const result = repository.findById('does-not-exist');

    expect(result).toBeUndefined();
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

    const result = repository.create(createRestaurantDto);

    expect(result).toEqual({
      id: 'restaurant-4',
      ...createRestaurantDto,
      rating: 0,
    });

    const foundRestaurant = repository.findById('restaurant-4');
    expect(foundRestaurant).toEqual(result);
  });

  it('should update a restaurant', () => {
    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'The Golden Fork Updated',
    };

    const result = repository.update('restaurant-1', updateRestaurantDto);
    expect(result).toEqual(
      expect.objectContaining({
        id: 'restaurant-1',
        name: 'The Golden Fork Updated',
        description: 'Modern European cuisine in a relaxed atmosphere.',
        cuisine: 'European',
        address: '12 Main Street',
        city: 'Johannesburg',
        rating: 4.7,
      }),
    );

    const foundRestaurant = repository.findById('restaurant-1');
    expect(foundRestaurant).toEqual(result);
  });

  it('should return undefined when updating a restaurant that does not exist', () => {
    const updateRestaurantDto: UpdateRestaurantDto = {
      name: 'Updated Name',
    };

    const result = repository.update('does-not-exist', updateRestaurantDto);
    expect(result).toBeUndefined();
  });

  it('should remove a restaurant', () => {
    const result = repository.remove('restaurant-1');

    expect(result).toBe(true);

    const foundRestaurant = repository.findById('restaurant-1');
    expect(foundRestaurant).toBeUndefined();
  });

  it('should return undefined when removing a restaurant that does not exist', () => {
    const result = repository.remove('does-not-exist');
    expect(result).toBe(false);
  });
});
