import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserRole } from './entities/user.entity.js';
import { PasswordHashingService } from './password-hashing.service.js';

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
    const passwordHash = await this.passwordHashingService.hash(
      createUserDto.password,
    );

    const user: User = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
      role: UserRole.CUSTOMER,
    };

    return this.usersRepository.create(user);
  }
}
