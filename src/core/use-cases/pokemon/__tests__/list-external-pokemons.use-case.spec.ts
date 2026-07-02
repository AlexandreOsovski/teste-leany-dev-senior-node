import { Test, TestingModule } from '@nestjs/testing';
import { ListExternalPokemonsUseCase } from '../list-external-pokemons.use-case';

describe('ListExternalPokemonsUseCase', () => {
  let useCase: ListExternalPokemonsUseCase;
  let pokemonApi: jest.Mocked<any>;

  const mockListResponse = {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=10&limit=10',
    previous: null,
    results: [
      { id: 1, name: 'bulbasaur', spriteUrl: 'https://example.com/1.png' },
      { id: 2, name: 'ivysaur', spriteUrl: 'https://example.com/2.png' },
      { id: 3, name: 'venusaur', spriteUrl: 'https://example.com/3.png' },
    ],
  };

  beforeEach(async () => {
    pokemonApi = {
      listPokemons: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListExternalPokemonsUseCase,
        {
          provide: 'IPokemonApi',
          useValue: pokemonApi,
        },
      ],
    }).compile();

    useCase = module.get(ListExternalPokemonsUseCase);
  });

  it('should list pokemons from external API', async () => {
    pokemonApi.listPokemons.mockResolvedValue(mockListResponse);

    const result = await useCase.execute({ offset: 0, limit: 10 });

    expect(result.count).toBe(1302);
    expect(result.results).toHaveLength(3);
    expect(result.results[0].name).toBe('bulbasaur');
    expect(pokemonApi.listPokemons).toHaveBeenCalledWith(0, 10);
  });

  it('should return empty results when offset exceeds count', async () => {
    pokemonApi.listPokemons.mockResolvedValue({
      count: 1302,
      next: null,
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=1290&limit=20',
      results: [],
    });

    const result = await useCase.execute({ offset: 2000, limit: 20 });

    expect(result.results).toHaveLength(0);
  });

  it('should handle API errors', async () => {
    pokemonApi.listPokemons.mockRejectedValue(
      new Error('Erro ao listar Pokémon: timeout'),
    );

    await expect(useCase.execute({ offset: 0, limit: 10 })).rejects.toThrow(
      'Erro ao listar Pokémon',
    );
  });
});
