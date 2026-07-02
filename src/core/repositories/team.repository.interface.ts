import { Team } from '../domain/entities/team.entity';

export interface ITeamRepository {
  findById(id: string): Promise<Team | null>;
  findByTrainerId(trainerId: string): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
  delete(id: string): Promise<void>;
  addPokemonToTeam(
    teamId: string,
    pokemonId: string,
    level: number,
  ): Promise<void>;
  removePokemonFromTeam(teamId: string, pokemonId: string): Promise<void>;
}
