export class TeamFullException extends Error {
  constructor(teamId: string) {
    super(`O time ${teamId} já atingiu o limite máximo de 5 Pokémon`);
    this.name = 'TeamFullException';
  }
}
