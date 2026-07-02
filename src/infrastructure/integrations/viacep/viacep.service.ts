import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  ICepApi,
  CepApiResponse,
} from '../../../core/integrations/cep-api.interface';
import { VIACEP_CONFIG } from '../../../config/viacep.config';

@Injectable()
export class ViaCepService implements ICepApi {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: VIACEP_CONFIG.BASE_URL,
      timeout: VIACEP_CONFIG.TIMEOUT_MS,
    });
  }

  async getAddressByCep(cep: string): Promise<CepApiResponse> {
    const rawCep = cep.replace(/\D/g, '');

    if (!this.validateCep(rawCep)) {
      throw new Error('CEP inválido');
    }

    try {
      const response = await this.client.get(`/${rawCep}/json/`);

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro || '',
        bairro: response.data.bairro || '',
        localidade: response.data.localidade || '',
        uf: response.data.uf || '',
      };
    } catch (error) {
      if (error.response) {
        throw new Error('Serviço ViaCEP indisponível');
      }
      throw error;
    }
  }

  validateCep(cep: string): boolean {
    const cepRegex = /^[0-9]{8}$/;
    return cepRegex.test(cep);
  }
}
