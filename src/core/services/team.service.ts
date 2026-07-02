import { Team } from '../domain/entities/team.entity';
import { ITeamRepository } from '../repositories/team.repository.interface';
import { PokemonService } from './pokemon.service';
import { TeamFullException } from '../domain/exceptions/team-full.exception';
import { DuplicatePokemonException } from '../domain/exceptions/duplicate-pokemon.exception';
import { Inject } from '@nestjs/common';

export class TeamService {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepository: ITeamRepository,
    private readonly pokemonService: PokemonService,
  ) {}

  async createTeam(trainerId: string, name: string): Promise<Team> {
    const team = new Team({
      name,
      trainerId,
    });

    return this.teamRepository.create(team);
  }

  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new Error(`Time ${id} não encontrado`);
    }
    return team;
  }

  async getTeamsByTrainerId(trainerId: string): Promise<Team[]> {
    return this.teamRepository.findByTrainerId(trainerId);
  }

  async updateTeamName(id: string, name: string): Promise<Team> {
    const team = await this.getTeamById(id);
    team.updateName(name);
    return this.teamRepository.update(team);
  }

  async addPokemonToTeam(
    teamId: string,
    externalId: string,
    level: number,
  ): Promise<void> {
    const team = await this.getTeamById(teamId);

    if (team.isFull()) {
      throw new TeamFullException(teamId);
    }

    const pokemon = await this.pokemonService.getOrSyncPokemon(
      Number(externalId),
    );

    if (team.hasPokemon(pokemon.getId())) {
      throw new DuplicatePokemonException(teamId, externalId);
    }

    await this.teamRepository.addPokemonToTeam(teamId, pokemon.getId(), level);
  }

  async removePokemonFromTeam(
    teamId: string,
    pokemonId: string,
  ): Promise<void> {
    const team = await this.getTeamById(teamId);

    if (!team.hasPokemon(pokemonId)) {
      throw new Error(`Pokémon ${pokemonId} não está no time ${teamId}`);
    }

    await this.teamRepository.removePokemonFromTeam(teamId, pokemonId);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.getTeamById(id);
    await this.teamRepository.delete(id);
  }
}
