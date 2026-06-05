export class Password {
  private readonly value: string;
  private readonly isHashed: boolean;

  private constructor(value: string, isHashed: boolean = false) {
    this.value = value;
    this.isHashed = isHashed;
  }

  public static create(value: string, isHashed: boolean = false): Password {
    if (!isHashed && value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    return new Password(value, isHashed);
  }

  public getValue(): string {
    return this.value;
  }

  public getIsHashed(): boolean {
    return this.isHashed;
  }
}