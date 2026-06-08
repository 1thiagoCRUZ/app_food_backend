import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao.silva@example.com', description: 'Email válido' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senhaFort3!', description: 'Senha de no mínimo 8 caracteres' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '123.456.789-09', description: 'CPF válido' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'cpf deve estar no formato "12345678909" ou "123.456.789-09"',
  })
  cpf: string;

  @ApiProperty({ example: '11999999999', description: 'Telefone com DDD', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'phone deve conter 10 ou 11 dígitos numéricos' })
  phone?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Avatar do usuário' })
  @IsOptional()
  photo?: any;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'RESTAURANT', 'DELIVERY'], required: false, description: 'Papel do usuário', default: 'CUSTOMER' })
  @IsString()
  @IsOptional()
  role?: string;
}