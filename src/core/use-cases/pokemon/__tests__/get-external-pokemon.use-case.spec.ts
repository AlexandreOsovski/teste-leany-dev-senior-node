import { Test, TestingModule } from '@nestjs/testing';
import { GetExternalPokemonUseCase } from '../get-external-pokemon.use-case';

describe('GetExternalPokemonUseCase', () => {
  let useCase: GetExternalPokemonUseCase;
  let pokemonApi: jest.Mocked<any>;

  const mockApiResponse = {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    spriteUrl: 'https://example.com/pikachu.png',
  };

  beforeEach(async () => {
    pokemonApi = {
      getPokemonById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetExternalPokemonUseCase,
        {
          provide: 'IPokemonApi',
          useValue: pokemonApi,
        },
      ],
    }).compile();

    useCase = module.get(GetExternalPokemonUseCase);
  });

  it('should get pokemon from external API', async () => {
    pokemonApi.getPokemonById.mockResolvedValue(mockApiResponse);

    const result = await useCase.execute({ id: 25 });

    expect(result).toEqual(mockApiResponse);
    expect(result.name).toBe('pikachu');
    expect(result.types).toContain('electric');
    expect(pokemonApi.getPokemonById).toHaveBeenCalledWith(25);
  });

  it('should throw error when pokemon not found', async () => {
    pokemonApi.getPokemonById.mockRejectedValue(
      new Error('Pokémon com ID 99999 não encontrado na PokéAPI'),
    );

    await expect(useCase.execute({ id: 99999 })).rejects.toThrow(
      'Pokémon com ID 99999 não encontrado na PokéAPI',
    );
  });

  it('should handle API timeout', async () => {
    pokemonApi.getPokemonById.mockRejectedValue(
      new Error('Falha ao buscar Pokémon 25 após 3 tentativas'),
    );

    await expect(useCase.execute({ id: 25 })).rejects.toThrow(
      'Falha ao buscar Pokémon 25',
    );
  });
});
