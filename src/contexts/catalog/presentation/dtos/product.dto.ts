import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID do Restaurante dono do produto' })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({ example: 'Pizza de Calabresa', description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Deliciosa pizza com cebola e azeitonas', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 49.90, description: 'Preço do produto' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'https://img.com/pizza.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  available?: boolean;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Pizza de Calabresa', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Deliciosa pizza com cebola e azeitonas', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 49.90, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'https://img.com/pizza.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  available?: boolean;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;
}
