import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { User, UserRole } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
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

    usersServiceMock.findAll.mockReturnValue(users);

    const result = controller.findAll();
    expect(usersServiceMock.findAll).toHaveBeenCalled();
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

  it('should return a user by id without the password hash', () => {
    const user: User = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'hashed-password-1',
      role: UserRole.CUSTOMER,
    };
    usersServiceMock.findById.mockReturnValue(user);

    const result = controller.findById('user-1');
    expect(usersServiceMock.findById).toHaveBeenCalledWith('user-1');
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

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'david@example.com',
      password: 'secret123',
    };

    const createdUser: User = {
      id: 'user-4',
      name: 'David Jones',
      email: 'david@example.com',
      passwordHash: 'test-argon2-hash',
      role: UserRole.CUSTOMER,
    };

    usersServiceMock.create.mockResolvedValue(createdUser);

    const result = await controller.create(createUserDto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto);
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

  it('should log in a user without returning the password hash', async () => {
    const loginDto: LoginDto = {
      email: 'alice@example.com',
      password: 'mySecretPassword123',
    };

    const user: User = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'test-argon2-hash',
      role: UserRole.CUSTOMER,
    };

    usersServiceMock.login.mockResolvedValue(user);

    const result = await controller.login(loginDto);

    expect(usersServiceMock.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual({
      statusCode: 200,
      message: 'Login successful',
      data: {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: UserRole.CUSTOMER,
      },
    });
  });
});
