export class Phone {
    private readonly value: string;
    private constructor(value: string) {
        this.value = value;
    }
    public static create(phone: string): Phone {
        if (!this.isValid(phone)) {
            throw new Error('Invalid phone number. Must contain exactly 11 digits (e.g. 11999999999).');
        }
        return new Phone(phone.replace(/\D/g, ''));
    }
    public getValue(): string {
        return this.value;
    }
    public getLastFourDigits(): string {
        return this.value.slice(-4);
    }
    private static isValid(phone: string): boolean {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length === 11;
    }
}
