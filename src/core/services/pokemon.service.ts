import { Pokemon } from '../domain/entities/pokemon.entity';
import { IPokemonRepository } from '../repositories/pokemon.repository.interface';
import { IPokemonApi } from '../integrations/pokemon-api.interface';
import { PokemonNotFoundException } from '../domain/exceptions/pokemon-not-found.exception';
import { POKEAPI_CONFIG } from '../../config/pokeapi.config';
import { Inject } from '@nestjs/common';

export class PokemonService {
  constructor(
    @Inject('IPokemonRepository')
    private readonly pokemonRepository: IPokemonRepository,
    @Inject('IPokemonApi')
    private readonly pokemonApi: IPokemonApi,
  ) {}

  async getOrSyncPokemon(externalId: number): Promise<Pokemon> {
    if (externalId < 1 || externalId > 898) {
      throw new PokemonNotFoundException(externalId);
    }

    const pokemon = await this.pokemonRepository.findByExternalId(externalId);

    if (!pokemon) {
      return this.syncPokemonFromApi(externalId);
    }

    if (pokemon.needsSync(POKEAPI_CONFIG.TTL_HOURS)) {
      return this.syncPokemonFromApi(externalId, pokemon);
    }

    return pokemon;
  }

  private async syncPokemonFromApi(
    externalId: number,
    existingPokemon?: Pokemon,
  ): Promise<Pokemon> {
    try {
      const apiData = await this.pokemonApi.getPokemonById(externalId);

      if (existingPokemon) {
        existingPokemon.updateFromApi({
          name: apiData.name,
          types: apiData.types,
          spriteUrl: apiData.spriteUrl,
        });
        return this.pokemonRepository.update(existingPokemon);
      }

      const newPokemon = new Pokemon({
        externalId: apiData.id,
        name: apiData.name,
        types: apiData.types,
        spriteUrl: apiData.spriteUrl,
      });
      return this.pokemonRepository.create(newPokemon);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      throw new Error(
        `Erro ao sincronizar Pokémon ${externalId}: ${errorMessage}`,
      );
    }
  }

  async forceSyncPokemon(externalId: number): Promise<Pokemon> {
    return this.syncPokemonFromApi(externalId);
  }

  async syncAllPokemons(
    limit: number = 50,
  ): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;

    const outdatedPokemons = await this.pokemonRepository.findOutdatedPokemons(
      POKEAPI_CONFIG.TTL_HOURS,
      limit,
    );

    for (const pokemon of outdatedPokemons) {
      try {
        await this.syncPokemonFromApi(pokemon.getExternalId(), pokemon);
        synced++;
      } catch (error) {
        console.log(
          `Erro ao sincronizar Pokémon ${pokemon.getExternalId()}:`,
          error,
        );
        errors++;
      }
    }

    return { synced, errors };
  }

  async getPokemonById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) {
      throw new PokemonNotFoundException(0);
    }
    return pokemon;
  }

  async getAllPokemons(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ pokemons: Pokemon[]; total: number }> {
    const skip =
      options?.page && options?.limit
        ? (options.page - 1) * options.limit
        : undefined;
    const take = options?.limit;

    return this.pokemonRepository.findAll({ skip, take });
  }
}
