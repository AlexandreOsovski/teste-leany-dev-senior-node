import { Injectable, Inject } from '@nestjs/common';
import {
  IPokemonApi,
  PokemonApiResponse,
} from '../../integrations/pokemon-api.interface';

export interface GetExternalPokemonInput {
  id: number;
}

@Injectable()
export class GetExternalPokemonUseCase {
  constructor(
    @Inject('IPokemonApi')
    private readonly pokemonApi: IPokemonApi,
  ) {}

  async execute(input: GetExternalPokemonInput): Promise<PokemonApiResponse> {
    return this.pokemonApi.getPokemonById(input.id);
  }
}
