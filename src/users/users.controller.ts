import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

// extras
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import type { AuthenticatedRequest } from './types/authenticated-request.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    const users = this.usersService.findAll();

    const safeUsers = users.map(
      ({ passwordHash: _passwordHash, ...user }) => user,
    );

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: safeUsers,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() request: AuthenticatedRequest) {
    const user = this.usersService.findById(request.user.sub);

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      statusCode: 200,
      message: 'Current user retrieved successfully',
      data: safeUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;

    const updatedUser = this.usersService.update(user.sub, updateUserDto);

    const { passwordHash: _passwordHash, ...safeUser } = updatedUser;

    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: safeUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.usersService.findById(id);

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: safeUser,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      statusCode: 201,
      message: 'User created successfully',
      data: safeUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { user, accessToken } = await this.usersService.login(loginDto);

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      statusCode: 200,
      message: 'Login successful',
      data: { user: safeUser, accessToken },
    };
  }
}
