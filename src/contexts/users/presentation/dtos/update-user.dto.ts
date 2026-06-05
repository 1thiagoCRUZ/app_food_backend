import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'cpf deve estar no formato "12345678909" ou "123.456.789-09"',
  })
  cpf?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'phone deve conter 10 ou 11 dígitos numéricos' })
  phone?: string;
}