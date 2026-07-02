import { Test, TestingModule } from '@nestjs/testing';
import { CreateTeamUseCase } from '../create-team.use-case';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../domain/entities/team.entity';

describe('CreateTeamUseCase', () => {
  let useCase: CreateTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  const mockTeam = new Team({
    id: 'team-id',
    name: 'Time Principal',
    trainerId: 'trainer-id',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            createTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should create a team successfully', async () => {
    teamService.createTeam.mockResolvedValue(mockTeam);

    const result = await useCase.execute({
      trainerId: 'trainer-id',
      name: 'Time Principal',
    });

    expect(result).toEqual(mockTeam);
    expect(result.getName()).toBe('Time Principal');
    expect(result.getTrainerId()).toBe('trainer-id');
  });

  it('should throw error when name is too short', async () => {
    teamService.createTeam.mockRejectedValue(
      new Error('Nome do time deve ter entre 3 e 50 caracteres'),
    );

    await expect(
      useCase.execute({ trainerId: 'trainer-id', name: 'AB' }),
    ).rejects.toThrow('Nome do time deve ter entre 3 e 50 caracteres');
  });

  it('should throw error when name is too long', async () => {
    teamService.createTeam.mockRejectedValue(
      new Error('Nome do time deve ter entre 3 e 50 caracteres'),
    );

    const longName = 'A'.repeat(51);
    await expect(
      useCase.execute({ trainerId: 'trainer-id', name: longName }),
    ).rejects.toThrow('Nome do time deve ter entre 3 e 50 caracteres');
  });
});
