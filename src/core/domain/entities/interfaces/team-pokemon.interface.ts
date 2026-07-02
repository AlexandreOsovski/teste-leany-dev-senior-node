export interface ITeamPokemon {
  getTeamId(): string;
  getPokemonId(): string;
  getLevel(): number;
  getAddedAt(): Date;
  updateLevel(level: number): void;
  toJSON(): Record<string, unknown>;
}
