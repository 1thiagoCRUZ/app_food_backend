import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'João da Silva', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123.456.789-09', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'cpf deve estar no formato "12345678909" ou "123.456.789-09"',
  })
  cpf?: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'phone deve conter 10 ou 11 dígitos numéricos' })
  phone?: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...', required: false, description: 'Avatar do usuário em Base64' })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'RESTAURANT', 'DELIVERY'], required: false, description: 'Papel do usuário' })
  @IsString()
  @IsOptional()
  role?: string;
}