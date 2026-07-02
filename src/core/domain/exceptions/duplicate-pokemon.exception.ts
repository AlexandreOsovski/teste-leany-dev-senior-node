export class DuplicatePokemonException extends Error {
  constructor(teamId: string, pokemonId: string) {
    super(`Pokémon ${pokemonId} já existe no time ${teamId}`);
    this.name = 'DuplicatePokemonException';
  }
}
