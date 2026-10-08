import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserRole } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  findById(id: string) {
    const user = this.usersRepository.findById(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: `temporary-${createUserDto.password}`,
      role: UserRole.CUSTOMER,
    };

    return this.usersRepository.create(user);
  }
}
