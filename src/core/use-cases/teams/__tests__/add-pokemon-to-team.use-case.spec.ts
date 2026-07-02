import { Test, TestingModule } from '@nestjs/testing';
import { AddPokemonToTeamUseCase } from '../add-pokemon-to-team.use-case';
import { TeamService } from '../../../services/team.service';
import { TeamFullException } from '../../../domain/exceptions/team-full.exception';
import { DuplicatePokemonException } from '../../../domain/exceptions/duplicate-pokemon.exception';

describe('AddPokemonToTeamUseCase', () => {
  let useCase: AddPokemonToTeamUseCase;
  let teamService: jest.Mocked<TeamService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddPokemonToTeamUseCase,
        {
          provide: TeamService,
          useValue: {
            addPokemonToTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(AddPokemonToTeamUseCase);
    teamService = module.get(TeamService);
  });

  it('should throw TeamFullException when team has 5 pokemons', async () => {
    teamService.addPokemonToTeam.mockRejectedValue(
      new TeamFullException('team-id'),
    );

    await expect(
      useCase.execute({ teamId: 'team-id', externalId: 25, level: 15 }),
    ).rejects.toThrow(TeamFullException);
  });

  it('should throw DuplicatePokemonException when pokemon already in team', async () => {
    teamService.addPokemonToTeam.mockRejectedValue(
      new DuplicatePokemonException('team-id', '25'),
    );

    await expect(
      useCase.execute({ teamId: 'team-id', externalId: 25, level: 15 }),
    ).rejects.toThrow(DuplicatePokemonException);
  });
});
