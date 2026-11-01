import { CreateMenuItemDto } from './dto/create-menu.dto.js';
import { MenusRepository } from './menus.repository.js';

describe('MenuRepository', () => {
  let repository: MenusRepository;

  beforeEach(() => {
    repository = new MenusRepository();
  });

  describe('findMenuByRestaurantId', () => {
    it('should return a menu for a valid restaurant ID', () => {
      const restaurantId = 'restaurant-1';
      const menu = repository.findMenuByRestaurantId(restaurantId);

      expect(menu).toBeDefined();
      expect(menu?.restaurantId).toBe(restaurantId);
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

    it('should return undefined for an invalid restaurant ID', () => {
      const restaurantId = 'invalid-restaurant-id';
      const menu = repository.findMenuByRestaurantId(restaurantId);

      expect(menu).toBeUndefined();
    });
  });

  describe('createMenuItem', () => {
    const createMenuItemDto: CreateMenuItemDto = {
      name: 'Test Menu Item',
      description: 'A test menu item for unit testing.',
      price: 9.99,
      imageUrl: 'https://example.com/test-menu-item.jpg',
    };

    it('should create a menu item for a valid restaurant and category', () => {
      const newMenuItem = repository.createMenuItem(
        'restaurant-1',
        'starters',
        createMenuItemDto,
      );

      expect(newMenuItem).toEqual({
        id: expect.any(String),
        ...createMenuItemDto,
      });
      expect(newMenuItem?.id).toBeTruthy();
    });

    it('should add the new menu item to the correct category', () => {
      const restaurantId = 'restaurant-1';
      const categoryId = 'starters';

      const newMenuItem = repository.createMenuItem(
        restaurantId,
        categoryId,
        createMenuItemDto,
      );

      const menu = repository.findMenuByRestaurantId(restaurantId);
      const category = menu?.categories.find((c) => c.id === categoryId);

      expect(category?.items).toContainEqual(newMenuItem);
    });

    it('should return undefined when the restaurant does not exist', () => {
      const restaurantId = 'invalid-restaurant';
      const categoryId = 'starters';

      const newMenuItem = repository.createMenuItem(
        restaurantId,
        categoryId,
        createMenuItemDto,
      );

      expect(newMenuItem).toBeUndefined();
    });

    it('should return undefined when the category does not exist', () => {
      const restaurantId = 'restaurant-1';
      const categoryId = 'invalid-category';

      const newMenuItem = repository.createMenuItem(
        restaurantId,
        categoryId,
        createMenuItemDto,
      );

      expect(newMenuItem).toBeUndefined();
    });
  });
});
