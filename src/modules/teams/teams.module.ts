import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamService } from '../../core/services/team.service';
import { TeamValidationService } from '../../core/services/team-validation.service';
import { TeamTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/team.typeorm-entity';
import { TeamPokemonTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/team-pokemon.typeorm-entity';
import { TeamRepository } from '../../infrastructure/database/typeorm/repositories/team.repository';
import { CreateTeamUseCase } from '../../core/use-cases/teams/create-team.use-case';
import { GetTeamUseCase } from '../../core/use-cases/teams/get-team.use-case';
import { ListTrainerTeamsUseCase } from '../../core/use-cases/teams/list-trainer-teams.use-case';
import { UpdateTeamUseCase } from '../../core/use-cases/teams/update-team.use-case';
import { DeleteTeamUseCase } from '../../core/use-cases/teams/delete-team.use-case';
import { AddPokemonToTeamUseCase } from '../../core/use-cases/teams/add-pokemon-to-team.use-case';
import { RemovePokemonFromTeamUseCase } from '../../core/use-cases/teams/remove-pokemon-from-team.use-case';
import { PokemonModule } from '../pokemon/pokemon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamTypeOrmEntity, TeamPokemonTypeOrmEntity]),
    PokemonModule,
  ],
  controllers: [TeamsController],
  providers: [
    TeamService,
    TeamValidationService,
    CreateTeamUseCase,
    GetTeamUseCase,
    ListTrainerTeamsUseCase,
    UpdateTeamUseCase,
    DeleteTeamUseCase,
    AddPokemonToTeamUseCase,
    RemovePokemonFromTeamUseCase,
    {
      provide: 'ITeamRepository',
      useClass: TeamRepository,
    },
  ],
  exports: [TeamService],
})
export class TeamsModule {}
