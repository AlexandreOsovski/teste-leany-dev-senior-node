import { Test, TestingModule } from '@nestjs/testing';
import { SyncPokemonUseCase } from '../sync-pokemon.use-case';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon } from '../../../domain/entities/pokemon.entity';

describe('SyncPokemonUseCase', () => {
  let useCase: SyncPokemonUseCase;
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
        SyncPokemonUseCase,
        {
          provide: PokemonService,
          useValue: {
            forceSyncPokemon: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(SyncPokemonUseCase);
    pokemonService = module.get(PokemonService);
  });

  it('should sync a pokemon successfully', async () => {
    pokemonService.forceSyncPokemon.mockResolvedValue(mockPokemon);

    const result = await useCase.execute({ externalId: 25 });

    expect(result).toEqual(mockPokemon);
    expect(result.getExternalId()).toBe(25);
  });

  it('should throw error when pokemon not found in API', async () => {
    pokemonService.forceSyncPokemon.mockRejectedValue(
      new Error('Erro ao sincronizar Pokémon 99999: Pokémon não encontrado'),
    );

    await expect(useCase.execute({ externalId: 99999 })).rejects.toThrow(
      'Erro ao sincronizar Pokémon 99999',
    );
  });

  it('should sync pokemon and update existing data', async () => {
    const updatedPokemon = new Pokemon({
      id: 'pokemon-id',
      externalId: 25,
      name: 'pikachu',
      types: ['electric'],
      spriteUrl: 'https://example.com/pikachu-new.png',
      lastSyncAt: new Date(),
    });

    pokemonService.forceSyncPokemon.mockResolvedValue(updatedPokemon);

    const result = await useCase.execute({ externalId: 25 });

    expect(result.getSpriteUrl()).toBe('https://example.com/pikachu-new.png');
  });
});
