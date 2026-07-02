import { Address } from './address.entity';
import { v4 as uuidv4 } from 'uuid';

export class Trainer {
  private id: string;
  private name: string;
  private email: string;
  private address?: Address;
  private deletedAt?: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    name: string;
    email: string;
    address?: Address;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || this.generateId();
    this.name = props.name;
    this.email = props.email.toLowerCase();
    this.address = props.address;
    this.deletedAt = props.deletedAt;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.validate();
  }

  private generateId(): string {
    return uuidv4();
  }

  private validate(): void {
    if (!this.name || this.name.length < 2) {
      throw new Error('Nome do treinador deve ter pelo menos 2 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Email inválido');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getAddress(): Address | undefined {
    return this.address;
  }
  getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  restore(): void {
    this.deletedAt = undefined;
    this.updatedAt = new Date();
  }

  updateProfile(props: { name?: string; email?: string }): void {
    if (props.name) {
      this.name = props.name;
    }
    if (props.email) {
      this.email = props.email.toLowerCase();
    }
    this.updatedAt = new Date();
    this.validate();
  }

  setAddress(address: Address): void {
    this.address = address;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address?.toJSON(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
