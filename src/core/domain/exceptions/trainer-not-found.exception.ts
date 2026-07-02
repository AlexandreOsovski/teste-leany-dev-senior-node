export class TrainerNotFoundException extends Error {
  constructor(id: string) {
    super(`Treinador com ID ${id} não encontrado`);
    this.name = 'TrainerNotFoundException';
  }
}
