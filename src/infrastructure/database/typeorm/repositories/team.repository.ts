import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITeamRepository } from '../../../../core/repositories/team.repository.interface';
import { Team } from '../../../../core/domain/entities/team.entity';
import { TeamTypeOrmEntity } from '../entities/team.typeorm-entity';
import { TeamPokemonTypeOrmEntity } from '../entities/team-pokemon.typeorm-entity';
import { TeamMapper } from '../mappers/team.mapper';

@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository(TeamTypeOrmEntity)
    private readonly repository: Repository<TeamTypeOrmEntity>,
    @InjectRepository(TeamPokemonTypeOrmEntity)
    private readonly teamPokemonRepository: Repository<TeamPokemonTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Team | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['pokemons', 'pokemons.pokemon'],
    });

    return entity ? TeamMapper.toDomain(entity) : null;
  }

  async findByTrainerId(trainerId: string): Promise<Team[]> {
    const entities = await this.repository.find({
      where: { trainerId },
      relations: ['pokemons', 'pokemons.pokemon'],
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => TeamMapper.toDomain(entity));
  }

  async create(team: Team): Promise<Team> {
    const entity = TeamMapper.toPersistence(team);
    const savedEntity = await this.repository.save(entity);
    return TeamMapper.toDomain(savedEntity);
  }

  async update(team: Team): Promise<Team> {
    const entity = TeamMapper.toPersistence(team);
    await this.repository.save(entity);
    return team;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async addPokemonToTeam(
    teamId: string,
    pokemonId: string,
    level: number,
  ): Promise<void> {
    const teamPokemon = this.teamPokemonRepository.create({
      teamId,
      pokemonId,
      level,
    });

    await this.teamPokemonRepository.save(teamPokemon);
  }

  async removePokemonFromTeam(
    teamId: string,
    pokemonId: string,
  ): Promise<void> {
    await this.teamPokemonRepository.delete({
      teamId,
      pokemonId,
    });
  }
}
