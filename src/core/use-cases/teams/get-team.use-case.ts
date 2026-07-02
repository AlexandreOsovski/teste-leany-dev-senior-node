import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/entities/team.entity';
import { TeamService } from '../../services/team.service';

@Injectable()
export class GetTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(id: string): Promise<Team> {
    return this.teamService.getTeamById(id);
  }
}
