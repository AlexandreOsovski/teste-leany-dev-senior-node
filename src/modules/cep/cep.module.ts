import { Module } from '@nestjs/common';
import { CepController } from './cep.controller';
import { ViaCepService } from '../../infrastructure/integrations/viacep/viacep.service';
import { GetAddressUseCase } from '../../core/use-cases/cep/get-address.use-case';

@Module({
  controllers: [CepController],
  providers: [
    ViaCepService,
    GetAddressUseCase,
    {
      provide: 'ICepApi',
      useClass: ViaCepService,
    },
  ],
  exports: [ViaCepService],
})
export class CepModule {}
