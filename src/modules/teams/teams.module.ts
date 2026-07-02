import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamService } from '../../core/services/team.service';
import { TeamValidationService } from '../../core/services/team-validation.service';
import { TeamTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/team.typeorm-entity';
import { TeamPokemonTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/team-pokemon.typeorm-entity';
import { TeamRepository } from '../../infrastructure/database/typeorm/repositories/team.repository';
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
    {
      provide: 'ITeamRepository',
      useClass: TeamRepository,
    },
  ],
  exports: [TeamService],
})
export class TeamsModule {}
