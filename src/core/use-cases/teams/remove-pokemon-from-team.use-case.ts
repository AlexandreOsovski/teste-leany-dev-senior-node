import { Injectable } from '@nestjs/common';
import { TeamService } from '../../services/team.service';

export interface RemovePokemonFromTeamInput {
  teamId: string;
  pokemonId: string;
}

@Injectable()
export class RemovePokemonFromTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(input: RemovePokemonFromTeamInput): Promise<void> {
    await this.teamService.removePokemonFromTeam(input.teamId, input.pokemonId);
  }
}
