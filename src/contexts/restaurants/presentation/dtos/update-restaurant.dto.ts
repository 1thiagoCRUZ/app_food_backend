import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
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
    @IsBoolean()
    isOpen?: boolean;
}