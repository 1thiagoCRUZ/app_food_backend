import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
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

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...', required: false, description: 'Foto do restaurante em Base64' })
  @IsString()
  @IsOptional()
  photo?: string;
}