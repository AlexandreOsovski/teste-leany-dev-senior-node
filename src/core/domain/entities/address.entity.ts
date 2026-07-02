import { Cep } from '../value-objects/cep.vo';
import { v4 as uuidv4 } from 'uuid';

export class Address {
  private id: string;
  private cep: Cep;
  private logradouro: string;
  private bairro: string;
  private localidade: string;
  private uf: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || this.generateId();
    this.cep = new Cep(props.cep);
    this.logradouro = props.logradouro;
    this.bairro = props.bairro;
    this.localidade = props.localidade;
    this.uf = props.uf;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private generateId(): string {
    return uuidv4();
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getCep(): Cep {
    return this.cep;
  }
  getLogradouro(): string {
    return this.logradouro;
  }
  getBairro(): string {
    return this.bairro;
  }
  getLocalidade(): string {
    return this.localidade;
  }
  getUf(): string {
    return this.uf;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateAddress(props: {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  }): void {
    this.logradouro = props.logradouro;
    this.bairro = props.bairro;
    this.localidade = props.localidade;
    this.uf = props.uf;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      cep: this.cep.getValue(),
      logradouro: this.logradouro,
      bairro: this.bairro,
      localidade: this.localidade,
      uf: this.uf,
    };
  }
}
