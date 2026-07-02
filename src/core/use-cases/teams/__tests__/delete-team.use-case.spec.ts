import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTeamUseCase } from '../delete-team.use-case';
import { TeamService } from '../../../services/team.service';

describe('DeleteTeamUseCase', () => {
  let useCase: DeleteTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            deleteTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(DeleteTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should delete team successfully', async () => {
    const deleteTeamSpy = jest.spyOn(teamService, 'deleteTeam');
    deleteTeamSpy.mockResolvedValue(undefined);

    await useCase.execute('team-id');

    expect(deleteTeamSpy).toHaveBeenCalledWith('team-id');
    expect(deleteTeamSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error when team not found', async () => {
    teamService.deleteTeam.mockRejectedValue(
      new Error('Time non-existent não encontrado'),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      'Time non-existent não encontrado',
    );
  });

  it('should not return any value on success', async () => {
    teamService.deleteTeam.mockResolvedValue(undefined);

    const result = await useCase.execute('team-id');

    expect(result).toBeUndefined();
  });
});
