import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

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
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const { passwordHash, ...safeUser } = user;

    return {
      statusCode: 201,
      message: 'User created successfully',
      data: safeUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);

    const { passwordHash, ...safeUser } = user;

    return {
      statusCode: 200,
      message: 'Login successful',
      data: safeUser,
    };
  }
}
