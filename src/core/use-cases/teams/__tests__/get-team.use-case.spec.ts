import { Test, TestingModule } from '@nestjs/testing';
import { GetTeamUseCase } from '../get-team.use-case';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../domain/entities/team.entity';
import { TeamPokemon } from '../../../domain/entities/team-pokemon.entity';

describe('GetTeamUseCase', () => {
  let useCase: GetTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            getTeamById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should return team with pokemons', async () => {
    const pokemon = new TeamPokemon({
      teamId: 'team-id',
      pokemonId: 'pokemon-id',
      level: 15,
    });
    const teamWithPokemon = new Team({
      id: 'team-id',
      name: 'Time Principal',
      trainerId: 'trainer-id',
      pokemons: [pokemon],
    });

    teamService.getTeamById.mockResolvedValue(teamWithPokemon);

    const result = await useCase.execute('team-id');

    expect(result.getPokemonCount()).toBe(1);
    expect(result.hasPokemon('pokemon-id')).toBe(true);
  });

  it('should throw error when team not found', async () => {
    teamService.getTeamById.mockRejectedValue(
      new Error('Time non-existent não encontrado'),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      'Time non-existent não encontrado',
    );
  });
});
