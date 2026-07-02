import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAddressUseCase } from '../../core/use-cases/cep/get-address.use-case';

@ApiTags('CEP')
@Controller('api/v1/cep')
export class CepController {
  constructor(private readonly getAddressUseCase: GetAddressUseCase) {}

  @Get(':cep')
  @ApiOperation({ summary: 'Consultar endereço por CEP' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 400, description: 'CEP inválido' })
  @ApiResponse({ status: 404, description: 'CEP não encontrado' })
  async getAddress(@Param('cep') cep: string) {
    return this.getAddressUseCase.execute({ cep });
  }
}
