import { Injectable } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity.js';

@Injectable()
export class UsersRepository {
  private readonly users: User[] = [
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
    {
      id: 'user-3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      passwordHash: 'hashed-password-3',
      role: UserRole.ADMIN,
    },
  ];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  create(user: User): User {
    this.users.push(user);

    return user;
  }
}
