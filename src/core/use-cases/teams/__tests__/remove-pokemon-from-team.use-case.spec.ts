import { Test, TestingModule } from '@nestjs/testing';
import { RemovePokemonFromTeamUseCase } from '../remove-pokemon-from-team.use-case';
import { TeamService } from '../../../services/team.service';

describe('RemovePokemonFromTeamUseCase', () => {
  let useCase: RemovePokemonFromTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemovePokemonFromTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            removePokemonFromTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(RemovePokemonFromTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should remove pokemon from team successfully', async () => {
    const spy = jest.spyOn(teamService, 'removePokemonFromTeam');
    spy.mockResolvedValue(undefined);

    await useCase.execute({
      teamId: 'team-id',
      pokemonId: 'pokemon-id',
    });

    expect(spy).toHaveBeenCalledWith('team-id', 'pokemon-id');
  });

  it('should throw error when pokemon not in team', async () => {
    teamService.removePokemonFromTeam.mockRejectedValue(
      new Error('Pokémon pokemon-id não está no time team-id'),
    );

    await expect(
      useCase.execute({ teamId: 'team-id', pokemonId: 'pokemon-id' }),
    ).rejects.toThrow('Pokémon pokemon-id não está no time team-id');
  });

  it('should throw error when team not found', async () => {
    teamService.removePokemonFromTeam.mockRejectedValue(
      new Error('Time non-existent não encontrado'),
    );

    await expect(
      useCase.execute({ teamId: 'non-existent', pokemonId: 'pokemon-id' }),
    ).rejects.toThrow('Time non-existent não encontrado');
  });

  it('should not return any value on success', async () => {
    teamService.removePokemonFromTeam.mockResolvedValue(undefined);

    const result = await useCase.execute({
      teamId: 'team-id',
      pokemonId: 'pokemon-id',
    });

    expect(result).toBeUndefined();
  });
});
