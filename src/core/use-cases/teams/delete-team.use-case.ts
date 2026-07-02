import { Injectable } from '@nestjs/common';
import { TeamService } from '../../services/team.service';

@Injectable()
export class DeleteTeamUseCase {
  constructor(private readonly teamService: TeamService) {}

  async execute(id: string): Promise<void> {
    await this.teamService.deleteTeam(id);
  }
}
