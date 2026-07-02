import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTeamUseCase } from '../../core/use-cases/teams/create-team.use-case';
import { GetTeamUseCase } from '../../core/use-cases/teams/get-team.use-case';
import { ListTrainerTeamsUseCase } from '../../core/use-cases/teams/list-trainer-teams.use-case';
import { UpdateTeamUseCase } from '../../core/use-cases/teams/update-team.use-case';
import { DeleteTeamUseCase } from '../../core/use-cases/teams/delete-team.use-case';
import { AddPokemonToTeamUseCase } from '../../core/use-cases/teams/add-pokemon-to-team.use-case';
import { RemovePokemonFromTeamUseCase } from '../../core/use-cases/teams/remove-pokemon-from-team.use-case';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddPokemonToTeamDto } from './dto/add-pokemon-to-team.dto';

@ApiTags('Teams')
@Controller('api/v1')
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly getTeamUseCase: GetTeamUseCase,
    private readonly listTrainerTeamsUseCase: ListTrainerTeamsUseCase,
    private readonly updateTeamUseCase: UpdateTeamUseCase,
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
    private readonly addPokemonToTeamUseCase: AddPokemonToTeamUseCase,
    private readonly removePokemonFromTeamUseCase: RemovePokemonFromTeamUseCase,
  ) {}

  @Post('trainers/:trainerId/teams')
  @ApiOperation({ summary: 'Criar time para treinador' })
  @ApiResponse({ status: 201, description: 'Time criado com sucesso' })
  async create(
    @Param('trainerId') trainerId: string,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.createTeamUseCase.execute({
      trainerId,
      name: createTeamDto.name,
    });
  }

  @Get('trainers/:trainerId/teams')
  @ApiOperation({ summary: 'Listar times do treinador' })
  @ApiResponse({ status: 200, description: 'Lista de times' })
  async findByTrainer(@Param('trainerId') trainerId: string) {
    return this.listTrainerTeamsUseCase.execute(trainerId);
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Buscar time com Pokémon' })
  @ApiResponse({ status: 200, description: 'Time encontrado' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getTeamUseCase.execute(id);
  }

  @Patch('teams/:id')
  @ApiOperation({ summary: 'Atualizar nome do time' })
  @ApiResponse({ status: 200, description: 'Time atualizado' })
  async update(@Param('id') id: string, @Body('name') name: string) {
    return this.updateTeamUseCase.execute({ id, name });
  }

  @Delete('teams/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir time' })
  @ApiResponse({ status: 204, description: 'Time excluído' })
  async remove(@Param('id') id: string) {
    await this.deleteTeamUseCase.execute(id);
  }

  @Post('teams/:id/pokemon')
  @ApiOperation({ summary: 'Adicionar Pokémon ao time' })
  @ApiResponse({ status: 200, description: 'Pokémon adicionado' })
  @ApiResponse({ status: 422, description: 'Time cheio ou Pokémon duplicado' })
  async addPokemon(
    @Param('id') teamId: string,
    @Body() addPokemonDto: AddPokemonToTeamDto,
  ) {
    await this.addPokemonToTeamUseCase.execute({
      teamId,
      externalId: addPokemonDto.externalId,
      level: addPokemonDto.level,
    });

    return { message: 'Pokémon adicionado ao time com sucesso' };
  }

  @Delete('teams/:id/pokemon/:pokemonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover Pokémon do time' })
  @ApiResponse({ status: 204, description: 'Pokémon removido' })
  async removePokemon(
    @Param('id') teamId: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    await this.removePokemonFromTeamUseCase.execute({ teamId, pokemonId });
  }
}
