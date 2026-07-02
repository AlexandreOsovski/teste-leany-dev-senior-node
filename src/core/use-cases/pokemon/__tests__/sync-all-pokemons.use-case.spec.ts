import { Test, TestingModule } from '@nestjs/testing';
import { SyncAllPokemonsUseCase } from '../sync-all-pokemons.use-case';
import { PokemonService } from '../../../services/pokemon.service';

describe('SyncAllPokemonsUseCase', () => {
  let useCase: SyncAllPokemonsUseCase;
  let pokemonService: jest.Mocked<PokemonService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncAllPokemonsUseCase,
        {
          provide: PokemonService,
          useValue: {
            syncAllPokemons: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(SyncAllPokemonsUseCase);
    pokemonService = module.get(PokemonService);
  });

  it('should sync all outdated pokemons', async () => {
    pokemonService.syncAllPokemons.mockResolvedValue({
      synced: 5,
      errors: 0,
    });

    const result = await useCase.execute({ limit: 10 });

    expect(result.synced).toBe(5);
    expect(result.errors).toBe(0);
  });

  it('should return partial success when some fail', async () => {
    pokemonService.syncAllPokemons.mockResolvedValue({
      synced: 3,
      errors: 2,
    });

    const result = await useCase.execute({ limit: 5 });

    expect(result.synced).toBe(3);
    expect(result.errors).toBe(2);
  });

  it('should return zero when no pokemons to sync', async () => {
    pokemonService.syncAllPokemons.mockResolvedValue({
      synced: 0,
      errors: 0,
    });

    const result = await useCase.execute({ limit: 10 });

    expect(result.synced).toBe(0);
    expect(result.errors).toBe(0);
  });
});
