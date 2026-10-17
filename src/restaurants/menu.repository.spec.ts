import { MenuRepository } from './menu.repository.js';

describe('MenuRepository', () => {
  let repository: MenuRepository;

  beforeEach(() => {
    repository = new MenuRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it.each(['restaurant-1', 'restaurant-2', 'restaurant-3'])(
    'should return a menu for %s',
    (restaurantId) => {
      const menu = repository.findMenuByRestaurantId(restaurantId);

      expect(menu).toBeDefined();
      expect(menu?.restaurantId).toBe(restaurantId);
      expect(menu?.categories.length).toBeGreaterThan(0);
    },
  );

  it('should return undefined for an unknown restaurant', () => {
    expect(
      repository.findMenuByRestaurantId('unknown-restaurant'),
    ).toBeUndefined();
  });

  it('should provide menu items with valid prices and image URLs', () => {
    const menu = repository.findMenuByRestaurantId('restaurant-1');

    expect(menu).toBeDefined();

    const items = menu!.categories.flatMap((c) => c.items);
    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item.name).toBeTruthy();
      expect(item.imageUrl).toMatch(/^https?:\/\/.+/);
      expect(item.description).toBeTruthy();
      expect(typeof item.price).toBe('number');
      expect(Number.isFinite(item.price)).toBe(true);
      expect(item.price).toBeGreaterThanOrEqual(0);
    }
  });
});
