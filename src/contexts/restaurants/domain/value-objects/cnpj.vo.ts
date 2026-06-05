export class CNPJ {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): CNPJ {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
        if (!cnpjRegex.test(value)) {
            throw new Error('Invalid CNPJ format');
        }
        return new CNPJ(value);
    }

    public getValue(): string {
        return this.value;
    }
}