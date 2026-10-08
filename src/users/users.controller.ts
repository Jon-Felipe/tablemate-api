import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    const users = this.usersService.findAll();

    const safeUsers = users.map(({ passwordHash, ...user }) => user);

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: safeUsers,
    };
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.usersService.findById(id);

    const { passwordHash, ...safeUser } = user;

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: safeUser,
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);

    const { passwordHash, ...safeUser } = user;

    return {
      statusCode: 201,
      message: 'User created successfully',
      data: safeUser,
    };
  }
}
