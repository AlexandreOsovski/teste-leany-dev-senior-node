import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/entities/team.entity';
import { TeamService } from '../../services/team.service';

@Injectable()
export class ListTrainerTeamsUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(trainerId: string): Promise<Team[]> {
    return this.teamService.getTeamsByTrainerId(trainerId);
  }
}
