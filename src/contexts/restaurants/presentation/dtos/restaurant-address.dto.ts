import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantAddressDto {
  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Logradouro' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '01001-000', description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: true, description: 'Se é o endereço principal', required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({ example: -23.550520, description: 'Latitude gerada pelo Maps', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -46.633308, description: 'Longitude gerada pelo Maps', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
