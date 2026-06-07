import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRestaurantDto {
  @ApiProperty({ example: 'Dentu Lanches', description: 'Nome do restaurante' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90', description: 'CNPJ do restaurante' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ example: true, description: 'Se o restaurante está aberto' })
  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;
}