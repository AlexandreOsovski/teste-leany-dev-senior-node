import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { TeamTypeOrmEntity } from './team.typeorm-entity';
import { PokemonTypeOrmEntity } from './pokemon.typeorm-entity';

@Entity('team_pokemons')
@Unique(['teamId', 'pokemonId'])
export class TeamPokemonTypeOrmEntity {
  @PrimaryColumn({ name: 'team_id', type: 'uuid' })
  teamId: string;

  @PrimaryColumn({ name: 'pokemon_id', type: 'uuid' })
  pokemonId: string;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;

  @ManyToOne(() => TeamTypeOrmEntity, (team) => team.pokemons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: TeamTypeOrmEntity;

  @ManyToOne(() => PokemonTypeOrmEntity, (pokemon) => pokemon.teamPokemons)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: PokemonTypeOrmEntity;
}
