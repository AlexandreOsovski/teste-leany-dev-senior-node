import { Team } from '../../../../core/domain/entities/team.entity';
import { TeamTypeOrmEntity } from '../entities/team.typeorm-entity';
import { TeamPokemonMapper } from './team-pokemon.mapper';

export class TeamMapper {
  static toDomain(entity: TeamTypeOrmEntity): Team {
    const pokemons =
      entity.pokemons?.map((tp) => TeamPokemonMapper.toDomain(tp)) || [];

    return new Team({
      id: entity.id,
      name: entity.name,
      trainerId: entity.trainerId,
      pokemons,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Team): TeamTypeOrmEntity {
    const entity = new TeamTypeOrmEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.trainerId = domain.getTrainerId();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
