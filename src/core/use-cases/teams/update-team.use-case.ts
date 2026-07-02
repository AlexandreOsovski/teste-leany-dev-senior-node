import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/entities/team.entity';
import { TeamService } from '../../services/team.service';

export interface UpdateTeamInput {
  id: string;
  name: string;
}

@Injectable()
export class UpdateTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(input: UpdateTeamInput): Promise<Team> {
    return this.teamService.updateTeamName(input.id, input.name);
  }
}
