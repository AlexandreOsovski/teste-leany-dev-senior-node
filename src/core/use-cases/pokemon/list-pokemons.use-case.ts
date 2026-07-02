import { Injectable } from '@nestjs/common';
import { Pokemon } from '../../domain/entities/pokemon.entity';
import { PokemonService } from '../../services/pokemon.service';

export interface ListPokemonsInput {
  page?: number;
  limit?: number;
}

export interface ListPokemonsOutput {
  pokemons: Pokemon[];
  total: number;
}

@Injectable()
export class ListPokemonsUseCase {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(input: ListPokemonsInput): Promise<ListPokemonsOutput> {
    return this.pokemonService.getAllPokemons({
      page: input.page,
      limit: input.limit,
    });
  }
}
