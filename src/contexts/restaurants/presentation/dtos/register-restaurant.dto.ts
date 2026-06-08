import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Foto do restaurante' })
  @IsOptional()
  photo?: any;
}