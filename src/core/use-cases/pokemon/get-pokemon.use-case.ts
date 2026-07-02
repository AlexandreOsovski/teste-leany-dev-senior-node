import { Injectable } from '@nestjs/common';
import { Pokemon } from '../../domain/entities/pokemon.entity';
import { PokemonService } from '../../services/pokemon.service';

@Injectable()
export class GetPokemonUseCase {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(id: string): Promise<Pokemon> {
    return this.pokemonService.getPokemonById(id);
  }
}
