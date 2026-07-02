import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTeamUseCase } from '../update-team.use-case';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../domain/entities/team.entity';

describe('UpdateTeamUseCase', () => {
  let useCase: UpdateTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  const mockTeam = new Team({
    id: 'team-id',
    name: 'Time Atualizado',
    trainerId: 'trainer-id',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            updateTeamName: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should update team name successfully', async () => {
    teamService.updateTeamName.mockResolvedValue(mockTeam);

    const result = await useCase.execute({
      id: 'team-id',
      name: 'Time Atualizado',
    });

    expect(result.getName()).toBe('Time Atualizado');
  });

  it('should throw error when new name is invalid', async () => {
    teamService.updateTeamName.mockRejectedValue(
      new Error('Nome do time deve ter entre 3 e 50 caracteres'),
    );

    await expect(
      useCase.execute({ id: 'team-id', name: 'AB' }),
    ).rejects.toThrow('Nome do time deve ter entre 3 e 50 caracteres');
  });

  it('should throw error when team not found', async () => {
    teamService.updateTeamName.mockRejectedValue(
      new Error('Time non-existent não encontrado'),
    );

    await expect(
      useCase.execute({ id: 'non-existent', name: 'Time' }),
    ).rejects.toThrow('Time non-existent não encontrado');
  });
});
