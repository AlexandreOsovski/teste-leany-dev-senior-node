import { Injectable } from '@nestjs/common';
import { PokemonService } from '../../services/pokemon.service';

export interface SyncAllPokemonsInput {
  limit?: number;
}

export interface SyncAllPokemonsOutput {
  synced: number;
  errors: number;
}

@Injectable()
export class SyncAllPokemonsUseCase {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(input: SyncAllPokemonsInput): Promise<SyncAllPokemonsOutput> {
    return this.pokemonService.syncAllPokemons(input.limit);
  }
}
