import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ViaCepService } from '../../infrastructure/integrations/viacep/viacep.service';

@ApiTags('CEP')
@Controller('api/v1/cep')
export class CepController {
  constructor(private readonly viaCepService: ViaCepService) {}

  @Get(':cep')
  @ApiOperation({ summary: 'Consultar endereço por CEP' })
  @ApiParam({
    name: 'cep',
    description: 'CEP para consulta',
    example: '01001-000',
  })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 400, description: 'CEP inválido' })
  @ApiResponse({ status: 404, description: 'CEP não encontrado' })
  async getAddress(@Param('cep') cep: string) {
    return this.viaCepService.getAddressByCep(cep);
  }
}
