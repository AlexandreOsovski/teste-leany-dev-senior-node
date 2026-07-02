export class InvalidPokemonLevelException extends Error {
  constructor(level: number) {
    super(`Level ${level} inválido. Deve estar entre 1 e 100`);
    this.name = 'InvalidPokemonLevelException';
  }
}
