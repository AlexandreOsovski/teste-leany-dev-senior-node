import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/pokemon.typeorm-entity';
import { PokemonRepository } from '../../infrastructure/database/typeorm/repositories/pokemon.repository';
import { PokeApiService } from '../../infrastructure/integrations/pokeapi/pokeapi.service';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonTypeOrmEntity])],
  controllers: [PokemonController],
  providers: [
    PokemonService,
    PokeApiService,
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
