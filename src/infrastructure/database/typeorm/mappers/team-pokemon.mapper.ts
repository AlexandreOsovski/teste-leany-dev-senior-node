import { TeamPokemon } from '../../../../core/domain/entities/team-pokemon.entity';
import { TeamPokemonTypeOrmEntity } from '../entities/team-pokemon.typeorm-entity';

export class TeamPokemonMapper {
  static toDomain(entity: TeamPokemonTypeOrmEntity): TeamPokemon {
    return new TeamPokemon({
      teamId: entity.teamId,
      pokemonId: entity.pokemonId,
      level: entity.level,
      addedAt: entity.addedAt,
    });
  }

  static toPersistence(domain: TeamPokemon): TeamPokemonTypeOrmEntity {
    const entity = new TeamPokemonTypeOrmEntity();
    entity.teamId = domain.getTeamId();
    entity.pokemonId = domain.getPokemonId();
    entity.level = domain.getLevel();
    entity.addedAt = domain.getAddedAt();

    return entity;
  }
}
