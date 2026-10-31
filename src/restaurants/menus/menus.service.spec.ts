import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service.js';
import { MenusRepository } from './menus.repository.js';
import { RestaurantsRepository } from '../restaurants.repository.js';

describe('MenusService', () => {
  let service: MenusService;

  const menuRepositoryMock = {
    findMenuByRestaurantId: vi.fn(),
    createMenuItem: vi.fn(),
  };

  const restaurantsServiceMock = {
    findById: vi.fn(),
  };

  beforeEach(async () => {
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
});
