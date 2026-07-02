import { Injectable } from '@nestjs/common';
import { ViaCepService } from '../../../infrastructure/integrations/viacep/viacep.service';

@Injectable()
export class GetAddressUseCase {
  constructor(private readonly cepApi: ViaCepService) {}

  async execute(input: { cep: string }) {
    return this.cepApi.getAddressByCep(input.cep);
  }
}
