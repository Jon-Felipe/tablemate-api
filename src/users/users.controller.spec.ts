import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { User, UserRole } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

describe('UsersController', () => {
  let controller: UsersController;

  const userssServiceMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userssServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users without password hashes', () => {
    const users: User[] = [
      {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        passwordHash: 'hashed-password-1',
        role: UserRole.CUSTOMER,
      },
      {
        id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        passwordHash: 'hashed-password-2',
        role: UserRole.STAFF,
      },
    ];

    userssServiceMock.findAll.mockReturnValue(users);

    const result = controller.findAll();
    expect(userssServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: [
        {
          id: 'user-1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: UserRole.CUSTOMER,
        },
        {
          id: 'user-2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: UserRole.STAFF,
        },
      ],
    });
  });

  it('should return a user by id with the password hash', () => {
    const user: User = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'hashed-password-1',
      role: UserRole.CUSTOMER,
    };
    userssServiceMock.findById.mockReturnValue(user);

    const result = controller.findById('user-1');
    expect(userssServiceMock.findById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: UserRole.CUSTOMER,
      },
    });
  });

  it('should create a user', () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'david@example.com',
      password: 'secret123',
    };

    const createdUser: User = {
      id: 'user-4',
      name: 'David Jones',
      email: 'david@example.com',
      passwordHash: 'temporary-secret123',
      role: UserRole.CUSTOMER,
    };

    userssServiceMock.create.mockReturnValue(createdUser);

    const result = controller.create(createUserDto);

    expect(userssServiceMock.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({
      statusCode: 201,
      message: 'User created successfully',
      data: {
        id: 'user-4',
        name: 'David Jones',
        email: 'david@example.com',
        role: UserRole.CUSTOMER,
      },
    });
  });
});
