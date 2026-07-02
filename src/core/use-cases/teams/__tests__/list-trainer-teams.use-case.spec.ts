import { Test, TestingModule } from '@nestjs/testing';
import { ListTrainerTeamsUseCase } from '../list-trainer-teams.use-case';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../domain/entities/team.entity';

describe('ListTrainerTeamsUseCase', () => {
  let useCase: ListTrainerTeamsUseCase;
  let teamService: jest.Mocked<TeamService>;

  const mockTeams = [
    new Team({ id: '1', name: 'Time A', trainerId: 'trainer-id' }),
    new Team({ id: '2', name: 'Time B', trainerId: 'trainer-id' }),
    new Team({ id: '3', name: 'Time C', trainerId: 'trainer-id' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTrainerTeamsUseCase,
        {
          provide: TeamService,
          useValue: {
            getTeamsByTrainerId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(ListTrainerTeamsUseCase);
    teamService = module.get(TeamService);
  });

  it('should return all teams for a trainer', async () => {
    teamService.getTeamsByTrainerId.mockResolvedValue(mockTeams);

    const result = await useCase.execute('trainer-id');

    expect(result).toHaveLength(3);
    expect(result[0].getName()).toBe('Time A');
    expect(result[1].getName()).toBe('Time B');
  });

  it('should return empty array when trainer has no teams', async () => {
    teamService.getTeamsByTrainerId.mockResolvedValue([]);

    const result = await useCase.execute('trainer-id');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
