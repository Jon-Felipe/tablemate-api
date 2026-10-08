import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserRole } from './entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepositoryMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', () => {
    const users = [
      { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
    ];
    usersRepositoryMock.findAll.mockReturnValue(users);

    const result = service.findAll();
    expect(result).toEqual(users);
  });

  it('should return a user by id', () => {
    const user = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    };
    usersRepositoryMock.findById.mockReturnValue(user);

    const result = service.findById('user-1');
    expect(result).toEqual(user);
  });

  it('should find a user using the provided id', () => {
    const user = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    };
    usersRepositoryMock.findById.mockReturnValue(user);

    service.findById('user-1');
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith('user-1');
  });

  it('should throw NotFoundException when a user does not exist', () => {
    usersRepositoryMock.findById.mockReturnValue(undefined);

    expect(() => {
      service.findById('does-not-exist');
    }).toThrow(NotFoundException);
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

    usersRepositoryMock.create.mockReturnValue(createdUser);

    const result = service.create(createUserDto);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'David Jones',
        email: 'david@example.com',
        passwordHash: 'temporary-secret123',
        role: UserRole.CUSTOMER,
      }),
    );
    expect(result).toEqual(createdUser);
  });
});
