export class PokemonNotFoundException extends Error {
  constructor(externalId: number) {
    super(`Pokémon com ID externo ${externalId} não encontrado`);
    this.name = 'PokemonNotFoundException';
  }
}
