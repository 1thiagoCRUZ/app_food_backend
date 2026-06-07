import { IsNumber, IsArray, ValidateNested, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID do Produto' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 'Pizza de Calabresa', description: 'Nome do produto no momento da compra' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 49.90, description: 'Preço unitário do produto' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 2, description: 'Quantidade comprada' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID do Restaurante' })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({ example: 1, description: 'ID do Endereço de Entrega do Usuário' })
  @IsNumber()
  @IsNotEmpty()
  deliveryAddressId: number;

  @ApiProperty({ example: 'PRIMEIRA_COMPRA', description: 'Código do cupom de desconto (opcional)', required: false })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Lista de itens do pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'PIX', enum: ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'VR'], description: 'Forma de pagamento escolhida' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'VR';
}
