export interface PokemonApiResponse {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string;
}

export interface IPokemonApi {
  getPokemonById(id: number): Promise<PokemonApiResponse>;
  healthCheck(): Promise<boolean>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: number;
    name: string;
    url: string;
  }>;
}

export interface IPokemonApi {
  getPokemonById(id: number): Promise<PokemonApiResponse>;
  listPokemons(offset: number, limit: number): Promise<PokemonListResponse>;
  healthCheck(): Promise<boolean>;
}
