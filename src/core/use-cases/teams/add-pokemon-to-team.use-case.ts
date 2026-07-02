import { Injectable } from '@nestjs/common';
import { TeamService } from '../../services/team.service';

export interface AddPokemonToTeamInput {
  teamId: string;
  externalId: number;
  level: number;
}

@Injectable()
export class AddPokemonToTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(input: AddPokemonToTeamInput): Promise<void> {
    await this.teamService.addPokemonToTeam(
      input.teamId,
      input.externalId.toString(),
      input.level,
    );
  }
}
