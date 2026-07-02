import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncPokemonDto {
  @ApiProperty({
    description: 'ID externo do Pokémon',
    example: 25,
  })
  @IsNumber()
  @Min(1)
  @Max(898)
  externalId: number;
}

export class SyncAllPokemonDto {
  @ApiPropertyOptional({
    description: 'Limite de Pokémon para sincronizar',
    example: 50,
    default: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
