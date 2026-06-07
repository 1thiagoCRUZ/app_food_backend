import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'joao.silva@example.com', description: 'Email de acesso' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha de acesso' })
  @IsString()
  @IsNotEmpty()
  password: string;
}