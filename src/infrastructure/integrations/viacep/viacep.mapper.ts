import { CepApiResponse } from '../../../core/integrations/cep-api.interface';

export class ViaCepMapper {
  static toDomain(apiData: any): CepApiResponse {
    return {
      cep: apiData.cep,
      logradouro: apiData.logradouro,
      bairro: apiData.bairro,
      localidade: apiData.localidade,
      uf: apiData.uf,
    };
  }
}
