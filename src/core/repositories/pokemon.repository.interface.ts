import { Pokemon } from '../domain/entities/pokemon.entity';

export interface IPokemonRepository {
  findById(id: string): Promise<Pokemon | null>;
  findByExternalId(externalId: number): Promise<Pokemon | null>;
  findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ pokemons: Pokemon[]; total: number }>;
  create(pokemon: Pokemon): Promise<Pokemon>;
  update(pokemon: Pokemon): Promise<Pokemon>;
  findOutdatedPokemons(ttlHours: number, limit?: number): Promise<Pokemon[]>;
}
