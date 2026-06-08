import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID do Restaurante dono do produto' })
  @Transform(({ value }) => Number(value))
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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;

  @ApiProperty({ example: true, required: false })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  available?: boolean;

  @ApiProperty({ example: 50, required: false })
  @Transform(({ value }) => Number(value))
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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;

  @ApiProperty({ example: true, required: false })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  available?: boolean;

  @ApiProperty({ example: 50, required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  stock?: number;
}
