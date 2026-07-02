import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  IPokemonApi,
  PokemonApiResponse,
} from '../../../core/integrations/pokemon-api.interface';
import { POKEAPI_CONFIG } from '../../../config/pokeapi.config';
import { PokeApiMapper } from './pokeapi.mapper';

@Injectable()
export class PokeApiService implements IPokemonApi {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: POKEAPI_CONFIG.BASE_URL,
      timeout: POKEAPI_CONFIG.TIMEOUT_MS,
    });
  }

  async getPokemonById(id: number): Promise<PokemonApiResponse> {
    for (let attempt = 0; attempt < POKEAPI_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await this.client.get(`/pokemon/${id}`);
        return PokeApiMapper.toDomain(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          throw new Error(`Pokémon com ID ${id} não encontrado na PokéAPI`);
        }

        if (attempt < POKEAPI_CONFIG.MAX_RETRIES - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      }
    }

    throw new Error(
      `Falha ao buscar Pokémon ${id} após ${POKEAPI_CONFIG.MAX_RETRIES} tentativas`,
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/pokemon/1');
      return true;
    } catch {
      return false;
    }
  }

  async listPokemons(offset: number = 0, limit: number = 20): Promise<any> {
    try {
      const response = await this.client.get('/pokemon', {
        params: { offset, limit },
      });

      // Enriquece com o ID extraído da URL
      const results = response.data.results.map((pokemon: any) => {
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return {
          id: parseInt(id),
          name: pokemon.name,
          spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results,
      };
    } catch (error) {
      throw new Error(`Erro ao listar Pokémon: ${error.message}`);
    }
  }
}
