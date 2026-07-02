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
