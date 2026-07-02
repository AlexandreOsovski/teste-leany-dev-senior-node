import { InvalidPokemonLevelException } from '../exceptions/invalid-pokemon-level.exception';
import { ITeamPokemon } from './interfaces/team-pokemon.interface';

export class TeamPokemon implements ITeamPokemon {
  private readonly teamId: string;
  private readonly pokemonId: string;
  private level: number;
  private readonly addedAt: Date;

  constructor(props: {
    teamId: string;
    pokemonId: string;
    level?: number;
    addedAt?: Date;
  }) {
    this.teamId = props.teamId;
    this.pokemonId = props.pokemonId;
    this.level = props.level ?? 1;
    this.addedAt = props.addedAt ?? new Date();
    this.validate();
  }

  private validate(): void {
    if (this.level < 1 || this.level > 100) {
      throw new InvalidPokemonLevelException(this.level);
    }
  }

  getTeamId(): string {
    return this.teamId;
  }

  getPokemonId(): string {
    return this.pokemonId;
  }

  getLevel(): number {
    return this.level;
  }

  getAddedAt(): Date {
    return this.addedAt;
  }

  updateLevel(level: number): void {
    this.level = level;
    this.validate();
  }

  toJSON(): Record<string, unknown> {
    return {
      teamId: this.teamId,
      pokemonId: this.pokemonId,
      level: this.level,
      addedAt: this.addedAt.toISOString(),
    };
  }
}
