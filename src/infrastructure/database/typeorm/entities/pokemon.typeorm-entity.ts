import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { TeamPokemonTypeOrmEntity } from './team-pokemon.typeorm-entity';

@Entity('pokemons')
export class PokemonTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'external_id', type: 'integer' })
  @Index()
  externalId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'simple-array' })
  types: string[];

  @Column({ name: 'sprite_url', type: 'varchar', length: 500 })
  spriteUrl: string;

  @Column({ name: 'last_sync_at', type: 'timestamp' })
  lastSyncAt: Date;

  @OneToMany(
    () => TeamPokemonTypeOrmEntity,
    (teamPokemon) => teamPokemon.pokemon,
  )
  teamPokemons: TeamPokemonTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
