import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateRestaurantDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsOptional()
    cnpj?: string;

    @IsBoolean()
    isOpen?: boolean;
}