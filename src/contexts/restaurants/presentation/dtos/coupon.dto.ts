import { IsString, IsNumber, Min, Max, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ example: 1, description: 'ID do Restaurante dono do cupom' })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({ example: 'DENTU10', description: 'Código promocional' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'percent', description: 'Tipo do desconto', enum: ['percent', 'fixed', 'shipping'] })
  @IsString()
  @IsNotEmpty()
  type: 'percent' | 'fixed' | 'shipping';

  @ApiProperty({ example: '10', description: 'Valor do desconto' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 50, description: 'Valor mínimo do pedido para aplicar' })
  @IsNumber()
  min: number;

  @ApiProperty({ example: 100, description: 'Limite de usos totais' })
  @IsNumber()
  limit: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', description: 'Data de expiração' })
  @IsDateString()
  expiresAt: string;
}
