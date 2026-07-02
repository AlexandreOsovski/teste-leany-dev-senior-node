import { PokemonApiResponse } from '../../../core/integrations/pokemon-api.interface';

export class PokeApiMapper {
  static toDomain(apiData: any): PokemonApiResponse {
    return {
      id: apiData.id,
      name: apiData.name,
      types: apiData.types.map((type: any) => type.type.name),
      spriteUrl:
        apiData.sprites?.front_default ||
        apiData.sprites?.other?.['official-artwork']?.front_default ||
        '',
    };
  }
}
