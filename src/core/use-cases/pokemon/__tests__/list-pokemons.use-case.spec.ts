import { Test, TestingModule } from '@nestjs/testing';
import { ListPokemonsUseCase } from '../list-pokemons.use-case';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon } from '../../../domain/entities/pokemon.entity';

describe('ListPokemonsUseCase', () => {
  let useCase: ListPokemonsUseCase;
  let pokemonService: jest.Mocked<PokemonService>;

  const mockPokemons = [
    new Pokemon({
      id: '1',
      externalId: 25,
      name: 'pikachu',
      types: ['electric'],
      spriteUrl: 'https://example.com/pikachu.png',
    }),
    new Pokemon({
      id: '2',
      externalId: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      spriteUrl: 'https://example.com/charizard.png',
    }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPokemonsUseCase,
        {
          provide: PokemonService,
          useValue: {
            getAllPokemons: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(ListPokemonsUseCase);
    pokemonService = module.get(PokemonService);
  });

  it('should return paginated pokemons', async () => {
    pokemonService.getAllPokemons.mockResolvedValue({
      pokemons: mockPokemons,
      total: 2,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.pokemons).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.pokemons[0].getName()).toBe('pikachu');
    expect(result.pokemons[1].getName()).toBe('charizard');
  });

  it('should return empty list when no pokemons', async () => {
    pokemonService.getAllPokemons.mockResolvedValue({
      pokemons: [],
      total: 0,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.pokemons).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
