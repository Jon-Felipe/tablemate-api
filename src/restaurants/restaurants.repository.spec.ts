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
    const result = repository.findAll({
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    expect(result).toHaveLength(10);
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
        expect.objectContaining({
          id: 'restaurant-10',
          name: 'The Breakfast Club',
        }),
      ]),
    );
  });

  it('should filter, sort, and paginate restaurants', () => {
    const result = repository.findAll({
      city: '  cape town ',
      cuisine: 'ITALIAN',
      page: 1,
      limit: 1,
      sortBy: 'name',
      sortOrder: 'desc',
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'restaurant-2',
        name: 'Casa Verde',
      }),
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

    const result = repository.create(createRestaurantDto, 'user-1');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'restaurant-11',
        ...createRestaurantDto,
        ownerId: 'user-1',
        slug: 'la-piazza',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    expect(
      repository.findAll({
        page: 1,
        limit: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
    ).toHaveLength(11);

    const foundRestaurant = repository.findById('restaurant-11');
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
        description:
          'Modern European cuisine in a relaxed atmosphere, with a focus on seasonal ingredients. The menu changes regularly to highlight the freshest produce available. A perfect spot for both casual dining and special occasions. Local wines and craft cocktails complement the menu beautifully. Ideal for both lunch and dinner, with a welcoming ambiance for all guests.',
        cuisine: 'European',
        address: '12 Main Street',
        city: 'Johannesburg',
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
