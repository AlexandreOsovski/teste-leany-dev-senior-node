import { Module } from '@nestjs/common';
import { CepController } from './cep.controller';
import { ViaCepService } from '../../infrastructure/integrations/viacep/viacep.service';

@Module({
  controllers: [CepController],
  providers: [ViaCepService],
  exports: [ViaCepService],
})
export class CepModule {}
