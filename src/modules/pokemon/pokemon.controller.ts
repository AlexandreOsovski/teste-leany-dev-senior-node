import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PokemonService } from '../../core/services/pokemon.service';

@ApiTags('Pokémon')
@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Listar Pokémon no banco local' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de Pokémon' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.pokemonService.getAllPokemons({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Pokémon local' })
  @ApiParam({ name: 'id', description: 'ID do Pokémon' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado' })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.pokemonService.getPokemonById(id);
  }

  @Post('sync/:externalId')
  @ApiOperation({ summary: 'Sincronizar Pokémon específico' })
  @ApiParam({ name: 'externalId', description: 'ID externo do Pokémon' })
  @ApiResponse({ status: 200, description: 'Pokémon sincronizado' })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado na PokéAPI',
  })
  async syncOne(@Param('externalId') externalId: number) {
    return this.pokemonService.forceSyncPokemon(externalId);
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Sincronizar todos os Pokémon desatualizados' })
  @ApiResponse({ status: 200, description: 'Sincronização concluída' })
  async syncAll(@Body('limit') limit?: number) {
    return this.pokemonService.syncAllPokemons(limit);
  }
}
