import { Injectable, Inject } from '@nestjs/common';
import {
  IPokemonApi,
  PokemonListResponse,
} from '../../integrations/pokemon-api.interface';

export interface ListExternalPokemonsInput {
  offset: number;
  limit: number;
}

@Injectable()
export class ListExternalPokemonsUseCase {
  constructor(
    @Inject('IPokemonApi')
    private readonly pokemonApi: IPokemonApi,
  ) {}

  async execute(
    input: ListExternalPokemonsInput,
  ): Promise<PokemonListResponse> {
    return this.pokemonApi.listPokemons(input.offset, input.limit);
  }
}
