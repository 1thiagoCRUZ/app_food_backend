import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { CPF } from '../value-objects/cpf.vo';

export interface UserProps {
  id?: number;
  name: string;
  email: Email;
  password: Password;
  cpf?: CPF;
  phone?: string;
  role?: string;
  photo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private id?: number;
  private name: string;
  private email: Email;
  private password: Password;
  private cpf?: CPF;
  private phone?: string;
  private role: string;
  private photo?: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.cpf = props.cpf;
    this.phone = props.phone;
    this.role = props.role || 'CUSTOMER';
    this.photo = props.photo;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: UserProps): User {
    return new User(props);
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  public updatePassword(password: Password): void {
    this.password = password;
    this.updatedAt = new Date();
  }

  public updateCpf(cpf: CPF): void {
    this.cpf = cpf;
    this.updatedAt = new Date();
  }

  public updatePhone(phone: string): void {
    this.phone = phone;
    this.updatedAt = new Date();
  }

  public updateRole(role: string): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  public updatePhoto(photo: string): void {
    this.photo = photo;
    this.updatedAt = new Date();
  }

  public getId(): number | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getCpf(): CPF | undefined {
    return this.cpf;
  }

  public getPhone(): string | undefined {
    return this.phone;
  }

  public getRole(): string {
    return this.role;
  }

  public getPhoto(): string | undefined {
    return this.photo;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}