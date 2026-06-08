import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantDto {
    @ApiProperty({ example: 'Dentu Lanches', required: false })
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({ example: '12.345.678/0001-90', required: false })
    @IsString()
    @IsOptional()
    cnpj?: string;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isOpen?: boolean;

    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Foto do restaurante' })
    @IsOptional()
    photo?: any;
}