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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TeamService } from '../../core/services/team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddPokemonToTeamDto } from './dto/add-pokemon-to-team.dto';

@ApiTags('Teams')
@Controller('api/v1')
export class TeamsController {
  constructor(private readonly teamService: TeamService) {}

  @Post('trainers/:trainerId/teams')
  @ApiOperation({ summary: 'Criar time para treinador' })
  @ApiParam({ name: 'trainerId', description: 'ID do treinador' })
  @ApiResponse({ status: 201, description: 'Time criado com sucesso' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  async create(
    @Param('trainerId') trainerId: string,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamService.createTeam(trainerId, createTeamDto.name);
  }

  @Get('trainers/:trainerId/teams')
  @ApiOperation({ summary: 'Listar times do treinador' })
  @ApiParam({ name: 'trainerId', description: 'ID do treinador' })
  @ApiResponse({ status: 200, description: 'Lista de times' })
  async findByTrainer(@Param('trainerId') trainerId: string) {
    return this.teamService.getTeamsByTrainerId(trainerId);
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Buscar time com Pokémon' })
  @ApiParam({ name: 'id', description: 'ID do time' })
  @ApiResponse({ status: 200, description: 'Time encontrado' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.teamService.getTeamById(id);
  }

  @Patch('teams/:id')
  @ApiOperation({ summary: 'Atualizar nome do time' })
  @ApiParam({ name: 'id', description: 'ID do time' })
  @ApiResponse({ status: 200, description: 'Time atualizado' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  async update(@Param('id') id: string, @Body('name') name: string) {
    return this.teamService.updateTeamName(id, name);
  }

  @Delete('teams/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir time' })
  @ApiParam({ name: 'id', description: 'ID do time' })
  @ApiResponse({ status: 204, description: 'Time excluído' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  async remove(@Param('id') id: string) {
    await this.teamService.deleteTeam(id);
  }

  @Post('teams/:id/pokemon')
  @ApiOperation({ summary: 'Adicionar Pokémon ao time' })
  @ApiParam({ name: 'id', description: 'ID do time' })
  @ApiResponse({ status: 200, description: 'Pokémon adicionado ao time' })
  @ApiResponse({ status: 422, description: 'Time cheio ou Pokémon duplicado' })
  @ApiResponse({ status: 404, description: 'Time ou Pokémon não encontrado' })
  async addPokemon(
    @Param('id') id: string,
    @Body() addPokemonDto: AddPokemonToTeamDto,
  ) {
    await this.teamService.addPokemonToTeam(
      id,
      addPokemonDto.externalId.toString(),
      addPokemonDto.level,
    );
    return { message: 'Pokémon adicionado ao time com sucesso' };
  }

  @Delete('teams/:id/pokemon/:pokemonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover Pokémon do time' })
  @ApiParam({ name: 'id', description: 'ID do time' })
  @ApiParam({ name: 'pokemonId', description: 'ID do Pokémon' })
  @ApiResponse({ status: 204, description: 'Pokémon removido do time' })
  @ApiResponse({ status: 404, description: 'Time ou Pokémon não encontrado' })
  async removePokemon(
    @Param('id') id: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    await this.teamService.removePokemonFromTeam(id, pokemonId);
  }
}
