import { Injectable } from '@nestjs/common';
import { Pokemon } from '../../domain/entities/pokemon.entity';
import { PokemonService } from '../../services/pokemon.service';

export interface SyncPokemonInput {
  externalId: number;
}

@Injectable()
export class SyncPokemonUseCase {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(input: SyncPokemonInput): Promise<Pokemon> {
    return this.pokemonService.forceSyncPokemon(input.externalId);
  }
}
