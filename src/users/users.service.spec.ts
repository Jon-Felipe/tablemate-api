import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserRole } from './entities/user.entity.js';
import { PasswordHashingService } from './password-hashing.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepositoryMock = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
  };

  const passwordHashingServiceMock = {
    hash: vi.fn().mockResolvedValue('test-argon2-hash'),
    verify: vi.fn(),
  };

  const jwtServiceMock = {
    signAsync: vi.fn().mockResolvedValue('test-access-token'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    passwordHashingServiceMock.hash.mockResolvedValue('test-argon2-hash');
    passwordHashingServiceMock.verify.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
        {
          provide: PasswordHashingService,
          useValue: passwordHashingServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
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

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);
    usersRepositoryMock.create.mockReturnValue(createdUser);

    const result = await service.create(createUserDto);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'David Jones',
        email: 'david@example.com',
        passwordHash: 'test-argon2-hash',
        role: UserRole.CUSTOMER,
      }),
    );
    expect(result).toEqual(createdUser);
  });

  it('should normalize the email when creating a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'David@Example.com',
      password: 'secret123',
    };

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);
    usersRepositoryMock.create.mockImplementation((u) => u);

    const result = await service.create(createUserDto);

    expect(result.email).toBe('david@example.com');

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'david@example.com',
      }),
    );
  });

  it('should not create a user when password hashing fails', async () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'David@Example.com',
      password: 'aSecurePassword123',
    };

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);
    passwordHashingServiceMock.hash.mockRejectedValue(
      new Error('Password hashing failed'),
    );

    await expect(service.create(createUserDto)).rejects.toThrow(
      'Password hashing failed',
    );
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when the email is already registered', async () => {
    usersRepositoryMock.findByEmail.mockReturnValue({
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'hashed-password-1',
      role: UserRole.CUSTOMER,
    });

    const createUserDto: CreateUserDto = {
      name: 'Another Alice',
      email: 'alice@example.com',
      password: 'secret123',
    };

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(passwordHashingServiceMock.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should reject registration when the email differs only by casing', async () => {
    usersRepositoryMock.findByEmail.mockReturnValue({
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'hashed-password-1',
      role: UserRole.CUSTOMER,
    });

    const createUserDto: CreateUserDto = {
      name: 'Another Alice',
      email: 'Alice@Example.com',
      password: 'secret123',
    };

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(passwordHashingServiceMock.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should hash the supplied password', async () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'david@example.com',
      password: 'secret123',
    };

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);
    usersRepositoryMock.create.mockImplementation((user) => user);

    await service.create(createUserDto);

    expect(passwordHashingServiceMock.hash).toHaveBeenCalledWith(
      createUserDto.password,
    );
  });

  it('should pass the password hash to the repository', async () => {
    const createUserDto: CreateUserDto = {
      name: 'David Jones',
      email: 'david@example.com',
      password: 'secret123',
    };

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);
    usersRepositoryMock.create.mockImplementation((user) => user);

    await service.create(createUserDto);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'test-argon2-hash',
        role: UserRole.CUSTOMER,
      }),
    );
  });

  it('should return the user when credentials are valid', async () => {
    const loginDto: LoginDto = {
      email: 'alice@example.com',
      password: 'mySecretPassword123',
    };

    const user = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'test-argon2-hash',
      role: UserRole.CUSTOMER,
    };

    usersRepositoryMock.findByEmail.mockReturnValue(user);
    passwordHashingServiceMock.verify.mockResolvedValue(true);

    const result = await service.login(loginDto);

    expect(result).toEqual({ user, accessToken: 'test-access-token' });
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'alice@example.com',
    );
    expect(passwordHashingServiceMock.verify).toHaveBeenCalledWith(
      loginDto.password,
      user.passwordHash,
    );
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      role: user.role,
    });
  });

  it('should reject login when the email does not exist', async () => {
    const loginDto: LoginDto = {
      email: 'unknown@example.com',
      password: 'mySecretPassword123',
    };

    usersRepositoryMock.findByEmail.mockReturnValue(undefined);

    await expect(service.login(loginDto)).rejects.toThrow(
      new UnauthorizedException('Invalid email or password'),
    );
    expect(passwordHashingServiceMock.verify).not.toHaveBeenCalled();
  });

  it('should reject login when the password is incorrect', async () => {
    const loginDto: LoginDto = {
      email: 'alice@example.com',
      password: 'incorrectPassword123',
    };

    const user = {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: 'test-argon2-hash',
      role: UserRole.CUSTOMER,
    };

    usersRepositoryMock.findByEmail.mockReturnValue(user);
    passwordHashingServiceMock.verify.mockResolvedValue(false);

    await expect(service.login(loginDto)).rejects.toThrow(
      new UnauthorizedException('Invalid email or password'),
    );
  });
});
