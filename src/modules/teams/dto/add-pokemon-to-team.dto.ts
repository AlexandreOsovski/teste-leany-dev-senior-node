import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPokemonToTeamDto {
  @ApiProperty({
    description: 'ID externo do Pokémon na PokéAPI',
    example: 25,
    minimum: 1,
    maximum: 898,
  })
  @IsNumber()
  @Min(1)
  @Max(898)
  externalId: number;

  @ApiProperty({
    description: 'Level do Pokémon no time',
    example: 15,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  level: number;
}
