import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    const users = this.usersService.findAll();

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.usersService.findById(id);

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  }
}
