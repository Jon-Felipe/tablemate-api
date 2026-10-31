import { Test, TestingModule } from '@nestjs/testing';

// extras
import { MenusController } from './menus.controller.js';
import { MenusService } from './menus.service.js';
import { JwtAuthGuard } from '../../users/jwt-auth.guard.js';

describe('MenusController', () => {
  let controller: MenusController;

  const menusServiceMock = {
    findMenuByRestaurantId: vi.fn(),
    createMenuItem: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [{ provide: MenusService, useValue: menusServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
