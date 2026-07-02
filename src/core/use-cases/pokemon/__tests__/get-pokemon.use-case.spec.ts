import { Test, TestingModule } from '@nestjs/testing';
import { GetPokemonUseCase } from '../get-pokemon.use-case';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon } from '../../../domain/entities/pokemon.entity';
import { PokemonNotFoundException } from '../../../domain/exceptions/pokemon-not-found.exception';

describe('GetPokemonUseCase', () => {
  let useCase: GetPokemonUseCase;
  let pokemonService: jest.Mocked<PokemonService>;

  const mockPokemon = new Pokemon({
    id: 'pokemon-id',
    externalId: 25,
    name: 'pikachu',
    types: ['electric'],
    spriteUrl: 'https://example.com/pikachu.png',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonUseCase,
        {
          provide: PokemonService,
          useValue: {
            getPokemonById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetPokemonUseCase);
    pokemonService = module.get(PokemonService);
  });

  it('should return a pokemon by id', async () => {
    pokemonService.getPokemonById.mockResolvedValue(mockPokemon);

    const result = await useCase.execute('pokemon-id');

    expect(result).toEqual(mockPokemon);
    expect(result.getName()).toBe('pikachu');
    expect(result.getExternalId()).toBe(25);
  });

  it('should throw PokemonNotFoundException when not found', async () => {
    pokemonService.getPokemonById.mockRejectedValue(
      new PokemonNotFoundException(0),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      PokemonNotFoundException,
    );
  });
});
