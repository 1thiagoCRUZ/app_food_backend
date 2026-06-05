import { Controller, Post, Body, Get, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserFacade } from '../../application/user.facade';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.userFacade.register(registerUserDto);
    return {
      message: 'User registered successfully',
      id: user.getId(),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.userFacade.login(loginDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return this.userFacade.list();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    await this.userFacade.update(id, updateUserDto);
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    await this.userFacade.delete(id);
  }
}