export class PokemonTypes {
  private readonly types: string[];

  constructor(types: string[]) {
    this.validate(types);
    this.types = [...new Set(types)]; // Remove duplicates
  }

  private validate(types: string[]): void {
    if (!types || types.length === 0) {
      throw new Error('Pokémon deve ter pelo menos um tipo');
    }
    if (types.length > 2) {
      throw new Error('Pokémon não pode ter mais de 2 tipos');
    }
  }

  getTypes(): string[] {
    return [...this.types];
  }

  hasType(type: string): boolean {
    return this.types.includes(type.toLowerCase());
  }

  toString(): string {
    return this.types.join(', ');
  }
}
