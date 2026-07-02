import { Team } from '../domain/entities/team.entity';
import { TeamFullException } from '../domain/exceptions/team-full.exception';
import { DuplicatePokemonException } from '../domain/exceptions/duplicate-pokemon.exception';

export class TeamValidationService {
  validateTeamCapacity(team: Team): void {
    if (team.isFull()) {
      throw new TeamFullException(team.getId());
    }
  }

  validatePokemonNotInTeam(team: Team, pokemonId: string): void {
    if (team.hasPokemon(pokemonId)) {
      throw new DuplicatePokemonException(team.getId(), pokemonId);
    }
  }

  validateTeamBelongsToTrainer(team: Team, trainerId: string): void {
    if (team.getTrainerId() !== trainerId) {
      throw new Error('Time não pertence a este treinador');
    }
  }
}
