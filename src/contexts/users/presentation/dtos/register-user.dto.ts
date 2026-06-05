import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional, Matches } from 'class-validator';
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
    @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'cpf deve estar no formato "12345678909" ou "123.456.789-09"',
  })
  cpf: string;
    @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'phone deve conter 10 ou 11 dígitos numéricos' })
  phone?: string;
}