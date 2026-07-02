import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainerDto {
  @ApiPropertyOptional({
    description: 'Nome do treinador',
    example: 'Ash Ketchum',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do treinador',
    example: 'ash@pokemon.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
