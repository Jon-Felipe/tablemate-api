import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PasswordHashingService } from './password-hashing.service.js';

@Module({
  providers: [UsersRepository, UsersService, PasswordHashingService],
  controllers: [UsersController],
})
export class UsersModule {}
