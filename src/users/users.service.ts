import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserRole } from './entities/user.entity.js';
import { PasswordHashingService } from './password-hashing.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  findById(id: string) {
    const user = this.usersRepository.findById(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = this.usersRepository.findByEmail(email);

    if (existingUser)
      throw new ConflictException('Email is already registered');

    const passwordHash = await this.passwordHashingService.hash(
      createUserDto.password,
    );

    const user: User = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email,
      passwordHash,
      role: UserRole.CUSTOMER,
    };

    return this.usersRepository.create(user);
  }

  async login(loginDto: LoginDto): Promise<User> {
    const email = loginDto.email.trim().toLowerCase();

    const user = this.usersRepository.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await this.passwordHashingService.verify(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }
}
