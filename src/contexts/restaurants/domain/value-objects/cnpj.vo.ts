import { BadRequestException } from '@nestjs/common';

export class CNPJ {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(rawValue: string): CNPJ {
        const digits = rawValue.replace(/\D/g, '');
        if (!CNPJ.isValid(digits)) {
            throw new BadRequestException(`CNPJ inválido: "${rawValue}". Forneça um CNPJ válido.`);
        }
        return new CNPJ(digits);
    }

    public getValue(): string {
        return this.value;
    }

    public getFormatted(): string {
        return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    private static isValid(digits: string): boolean {
        if (digits.length !== 14) return false;
        
        if (/^(\d)\1{13}$/.test(digits)) return false;

        let length = digits.length - 2;
        let numbers = digits.substring(0, length);
        const digitsStr = digits.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digitsStr.charAt(0))) return false;

        length = length + 1;
        numbers = digits.substring(0, length);
        sum = 0;
        pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digitsStr.charAt(1))) return false;

        return true;
    }
}