import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IPokemonRepository } from '../../../../core/repositories/pokemon.repository.interface';
import { Pokemon } from '../../../../core/domain/entities/pokemon.entity';
import { PokemonTypeOrmEntity } from '../entities/pokemon.typeorm-entity';
import { PokemonMapper } from '../mappers/pokemon.mapper';

@Injectable()
export class PokemonRepository implements IPokemonRepository {
  constructor(
    @InjectRepository(PokemonTypeOrmEntity)
    private readonly repository: Repository<PokemonTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Pokemon | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? PokemonMapper.toDomain(entity) : null;
  }

  async findByExternalId(externalId: number): Promise<Pokemon | null> {
    const entity = await this.repository.findOne({
      where: { externalId },
    });

    return entity ? PokemonMapper.toDomain(entity) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ pokemons: Pokemon[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: options?.skip,
      take: options?.take,
      order: { externalId: 'ASC' },
    });

    return {
      pokemons: entities.map((entity) => PokemonMapper.toDomain(entity)),
      total,
    };
  }

  async create(pokemon: Pokemon): Promise<Pokemon> {
    const entity = PokemonMapper.toPersistence(pokemon);
    const savedEntity = await this.repository.save(entity);
    return PokemonMapper.toDomain(savedEntity);
  }

  async update(pokemon: Pokemon): Promise<Pokemon> {
    const entity = PokemonMapper.toPersistence(pokemon);
    await this.repository.save(entity);
    return pokemon;
  }

  async findOutdatedPokemons(
    ttlHours: number,
    limit?: number,
  ): Promise<Pokemon[]> {
    const outdatedDate = new Date(Date.now() - ttlHours * 60 * 60 * 1000);

    const entities = await this.repository.find({
      where: {
        lastSyncAt: LessThan(outdatedDate),
      },
      take: limit || 50,
      order: { lastSyncAt: 'ASC' },
    });

    return entities.map((entity) => PokemonMapper.toDomain(entity));
  }
}
