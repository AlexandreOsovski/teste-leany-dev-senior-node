import { Pokemon } from '../../../../core/domain/entities/pokemon.entity';
import { PokemonTypeOrmEntity } from '../entities/pokemon.typeorm-entity';

export class PokemonMapper {
  static toDomain(entity: PokemonTypeOrmEntity): Pokemon {
    return new Pokemon({
      id: entity.id,
      externalId: entity.externalId,
      name: entity.name,
      types: entity.types,
      spriteUrl: entity.spriteUrl,
      lastSyncAt: entity.lastSyncAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Pokemon): PokemonTypeOrmEntity {
    const entity = new PokemonTypeOrmEntity();
    entity.id = domain.getId();
    entity.externalId = domain.getExternalId();
    entity.name = domain.getName();
    entity.types = domain.getTypes();
    entity.spriteUrl = domain.getSpriteUrl();
    entity.lastSyncAt = domain.getLastSyncAt();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
