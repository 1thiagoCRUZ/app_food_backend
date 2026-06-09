import { IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourierProfileDto {
  @ApiPropertyOptional({ example: '12345678901', description: 'CNH do entregador' })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'A CNH deve ter exatamente 11 caracteres' })
  cnh?: string;

  @ApiPropertyOptional({ example: 'ABC1234', description: 'Placa do veículo' })
  @IsOptional()
  @IsString()
  @Length(7, 7, { message: 'A placa deve ter exatamente 7 caracteres' })
  vehiclePlate?: string;
}
