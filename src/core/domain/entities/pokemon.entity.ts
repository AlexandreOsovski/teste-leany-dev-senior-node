import { PokemonTypes } from '../value-objects/pokemon-types.vo';
import { v4 as uuidv4 } from 'uuid';

export class Pokemon {
  private id: string;
  private externalId: number;
  private name: string;
  private types: PokemonTypes;
  private spriteUrl: string;
  private lastSyncAt: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    externalId: number;
    name: string;
    types: string[];
    spriteUrl: string;
    lastSyncAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || this.generateId();
    this.externalId = props.externalId;
    this.name = props.name;
    this.types = new PokemonTypes(props.types);
    this.spriteUrl = props.spriteUrl;
    this.lastSyncAt = props.lastSyncAt || new Date();
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.validate();
  }

  private generateId(): string {
    return uuidv4();
  }

  private validate(): void {
    if (!this.externalId || this.externalId < 1 || this.externalId > 898) {
      throw new Error('ID externo do Pokémon deve estar entre 1 e 898');
    }
    if (!this.name || this.name.length < 1) {
      throw new Error('Nome do Pokémon é obrigatório');
    }
    if (!this.spriteUrl) {
      throw new Error('URL do sprite é obrigatória');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getExternalId(): number {
    return this.externalId;
  }
  getName(): string {
    return this.name;
  }
  getTypes(): string[] {
    return this.types.getTypes();
  }
  getSpriteUrl(): string {
    return this.spriteUrl;
  }
  getLastSyncAt(): Date {
    return this.lastSyncAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  needsSync(ttlHours: number): boolean {
    const now = new Date();
    const diffHours =
      (now.getTime() - this.lastSyncAt.getTime()) / (1000 * 60 * 60);
    return diffHours >= ttlHours;
  }

  updateFromApi(data: {
    name: string;
    types: string[];
    spriteUrl: string;
  }): void {
    this.name = data.name;
    this.types = new PokemonTypes(data.types);
    this.spriteUrl = data.spriteUrl;
    this.lastSyncAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      name: this.name,
      types: this.types.getTypes(),
      spriteUrl: this.spriteUrl,
      lastSyncAt: this.lastSyncAt,
    };
  }
}
