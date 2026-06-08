import { Controller, Post, Body, Get, Put, Param, Delete, HttpCode, HttpStatus, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFacade } from '../../application/user.facade';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateAddressDto } from '../dtos/address.dto';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  async register(@Body() registerUserDto: RegisterUserDto, @UploadedFile() file?: Express.Multer.File) {
    const user = await this.userFacade.register(registerUserDto, file);
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.userFacade.getById(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: number) {
    return this.userFacade.getById(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req, @UploadedFile() file?: Express.Multer.File) {
    if (id != req.user.userId) {
      throw new ForbiddenException('Você só pode editar sua própria conta');
    }
    await this.userFacade.update(id, updateUserDto, file);
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @Request() req) {
    if (id != req.user.userId) {
      throw new ForbiddenException('Você só pode excluir sua própria conta');
    }
    await this.userFacade.delete(id);
  }

  @Post('me/addresses')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.userFacade.addAddress(req.user.userId, createAddressDto);
  }

  @Get('me/addresses')
  @UseGuards(JwtAuthGuard)
  async listAddresses(@Request() req) {
    return this.userFacade.listAddresses(req.user.userId);
  }
}