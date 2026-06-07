import { BadRequestException } from '@nestjs/common';

export class CPF {
  private readonly value: string; 
  private constructor(value: string) {
    this.value = value;
  }
  public static create(rawCpf: string): CPF {
    const digits = rawCpf.replace(/\D/g, '');
    if (!CPF.isValid(digits)) {
      throw new BadRequestException(
        `CPF inválido: "${rawCpf}". Forneça um CPF válido no formato "12345678909" ou "123.456.789-09".`
      );
    }
    return new CPF(digits);
  }
  public getValue(): string {
    return this.value;
  }
  public getFormatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
    private static isValid(digits: string): boolean {
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;
    return true;
  }
}
