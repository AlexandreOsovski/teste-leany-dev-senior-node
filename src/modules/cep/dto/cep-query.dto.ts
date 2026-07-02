import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CepQueryDto {
  @ApiProperty({
    description: 'CEP para consulta',
    example: '01001-000',
  })
  @IsString()
  @Matches(/^[0-9]{5}-?[0-9]{3}$/, {
    message: 'CEP deve estar no formato XXXXX-XXX ou XXXXXXXX',
  })
  cep: string;
}
