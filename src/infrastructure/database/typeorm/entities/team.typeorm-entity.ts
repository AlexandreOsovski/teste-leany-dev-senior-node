import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TrainerTypeOrmEntity } from './trainer.typeorm-entity';
import { TeamPokemonTypeOrmEntity } from './team-pokemon.typeorm-entity';

@Entity('teams')
export class TeamTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'trainer_id', type: 'uuid' })
  trainerId: string;

  @ManyToOne(() => TrainerTypeOrmEntity, (trainer) => trainer.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trainer_id' })
  trainer: TrainerTypeOrmEntity;

  @OneToMany(
    () => TeamPokemonTypeOrmEntity,
    (teamPokemon) => teamPokemon.team,
    {
      cascade: true,
    },
  )
  pokemons: TeamPokemonTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
