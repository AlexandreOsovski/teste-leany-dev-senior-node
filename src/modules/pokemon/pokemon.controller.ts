import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetPokemonUseCase } from '../../core/use-cases/pokemon/get-pokemon.use-case';
import { ListPokemonsUseCase } from '../../core/use-cases/pokemon/list-pokemons.use-case';
import { SyncPokemonUseCase } from '../../core/use-cases/pokemon/sync-pokemon.use-case';
import { SyncAllPokemonsUseCase } from '../../core/use-cases/pokemon/sync-all-pokemons.use-case';
import { GetExternalPokemonUseCase } from '../../core/use-cases/pokemon/get-external-pokemon.use-case';
import { ListExternalPokemonsUseCase } from '../../core/use-cases/pokemon/list-external-pokemons.use-case';

@ApiTags('Pokémon')
@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(
    private readonly getPokemonUseCase: GetPokemonUseCase,
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly syncPokemonUseCase: SyncPokemonUseCase,
    private readonly syncAllPokemonsUseCase: SyncAllPokemonsUseCase,
    private readonly getExternalPokemonUseCase: GetExternalPokemonUseCase,
    private readonly listExternalPokemonsUseCase: ListExternalPokemonsUseCase,
  ) {}

  @Get('external/:id')
  @ApiOperation({ summary: 'Buscar Pokémon direto da PokéAPI' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado' })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async findExternal(@Param('id') id: number) {
    return this.getExternalPokemonUseCase.execute({ id });
  }

  @Get('external')
  @ApiOperation({ summary: 'Listar Pokémon disponíveis na PokéAPI (paginado)' })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async listExternal(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.listExternalPokemonsUseCase.execute({
      offset: offset || 0,
      limit: Math.min(limit || 20, 50),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar Pokémon no banco local' })
  @ApiResponse({ status: 200, description: 'Lista de Pokémon' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.listPokemonsUseCase.execute({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Pokémon local' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado' })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getPokemonUseCase.execute(id);
  }

  @Post('sync/:externalId')
  @ApiOperation({ summary: 'Sincronizar Pokémon específico' })
  @ApiResponse({ status: 200, description: 'Pokémon sincronizado' })
  async syncOne(@Param('externalId') externalId: number) {
    return this.syncPokemonUseCase.execute({ externalId });
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Sincronizar todos os Pokémon' })
  @ApiResponse({ status: 200, description: 'Sincronização concluída' })
  async syncAll(@Body('limit') limit?: number) {
    return this.syncAllPokemonsUseCase.execute({ limit });
  }
}
