import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainerDto {
  @ApiProperty({
    description: 'Nome do treinador',
    example: 'Ash Ketchum',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Email do treinador',
    example: 'ash@pokemon.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'CEP para busca automática de endereço',
    example: '01001-000',
  })
  @IsOptional()
  @Matches(/^[0-9]{5}-?[0-9]{3}$/, {
    message: 'CEP deve estar no formato XXXXX-XXX ou XXXXXXXX',
  })
  cep?: string;
}
