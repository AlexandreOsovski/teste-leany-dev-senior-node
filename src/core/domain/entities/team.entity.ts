import { v4 as uuidv4 } from 'uuid';
import { TeamFullException } from '../exceptions/team-full.exception';
import { DuplicatePokemonException } from '../exceptions/duplicate-pokemon.exception';
import { TeamPokemon } from './team-pokemon.entity';

export class Team {
  private id: string;
  private name: string;
  private trainerId: string;
  private pokemons: TeamPokemon[];
  private createdAt: Date;
  private updatedAt: Date;

  private static readonly MAX_POKEMONS = 5;

  constructor(props: {
    id?: string;
    name: string;
    trainerId: string;
    pokemons?: TeamPokemon[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.trainerId = props.trainerId;
    this.pokemons = props.pokemons ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.length < 3 || this.name.length > 50) {
      throw new Error('Nome do time deve ter entre 3 e 50 caracteres');
    }
    if (!this.trainerId) {
      throw new Error('Time deve pertencer a um treinador');
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getTrainerId(): string {
    return this.trainerId;
  }

  getPokemons(): TeamPokemon[] {
    return [...this.pokemons];
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPokemonCount(): number {
    return this.pokemons.length;
  }

  isFull(): boolean {
    return this.pokemons.length >= Team.MAX_POKEMONS;
  }

  hasPokemon(pokemonId: string): boolean {
    for (const pokemon of this.pokemons) {
      if (pokemon.getPokemonId() === pokemonId) {
        return true;
      }
    }
    return false;
  }

  addPokemon(teamPokemon: TeamPokemon): void {
    if (this.isFull()) {
      throw new TeamFullException(this.id);
    }

    if (this.hasPokemon(teamPokemon.getPokemonId())) {
      throw new DuplicatePokemonException(this.id, teamPokemon.getPokemonId());
    }

    this.pokemons.push(teamPokemon);
    this.updatedAt = new Date();
  }

  removePokemon(pokemonId: string): void {
    let indexToRemove = -1;

    for (let i = 0; i < this.pokemons.length; i++) {
      if (this.pokemons[i].getPokemonId() === pokemonId) {
        indexToRemove = i;
        break;
      }
    }

    if (indexToRemove === -1) {
      throw new Error(`Pokémon ${pokemonId} não encontrado no time`);
    }

    this.pokemons.splice(indexToRemove, 1);
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
    this.validate();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      trainerId: this.trainerId,
      pokemons: this.pokemons.map((pokemon) => pokemon.toJSON()),
      pokemonCount: this.getPokemonCount(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
