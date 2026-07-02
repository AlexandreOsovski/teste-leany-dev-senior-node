import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/entities/team.entity';
import { TeamService } from '../../services/team.service';

export interface CreateTeamInput {
  trainerId: string;
  name: string;
}

@Injectable()
export class CreateTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(input: CreateTeamInput): Promise<Team> {
    return this.teamService.createTeam(input.trainerId, input.name);
  }
}
