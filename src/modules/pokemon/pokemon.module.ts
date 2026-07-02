import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/pokemon.typeorm-entity';
import { PokemonRepository } from '../../infrastructure/database/typeorm/repositories/pokemon.repository';
import { PokeApiService } from '../../infrastructure/integrations/pokeapi/pokeapi.service';
import { GetPokemonUseCase } from '../../core/use-cases/pokemon/get-pokemon.use-case';
import { ListPokemonsUseCase } from '../../core/use-cases/pokemon/list-pokemons.use-case';
import { SyncPokemonUseCase } from '../../core/use-cases/pokemon/sync-pokemon.use-case';
import { SyncAllPokemonsUseCase } from '../../core/use-cases/pokemon/sync-all-pokemons.use-case';
import { GetExternalPokemonUseCase } from '../../core/use-cases/pokemon/get-external-pokemon.use-case';
import { ListExternalPokemonsUseCase } from '../../core/use-cases/pokemon/list-external-pokemons.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonTypeOrmEntity])],
  controllers: [PokemonController],
  providers: [
    PokemonService,
    PokeApiService,
    GetPokemonUseCase,
    ListPokemonsUseCase,
    SyncPokemonUseCase,
    SyncAllPokemonsUseCase,
    GetExternalPokemonUseCase,
    ListExternalPokemonsUseCase,
    {
      provide: 'IPokemonRepository',
      useClass: PokemonRepository,
    },
    {
      provide: 'IPokemonApi',
      useClass: PokeApiService,
    },
  ],
  exports: [PokemonService],
})
export class PokemonModule {}
