import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class RegisterRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;
}