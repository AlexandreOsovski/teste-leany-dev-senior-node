import { Test, TestingModule } from '@nestjs/testing';
import { GetAddressUseCase } from '../get-address.use-case';
import { ViaCepService } from '../../../../infrastructure/integrations/viacep/viacep.service';

describe('GetAddressUseCase', () => {
  let useCase: GetAddressUseCase;
  let viaCepService: jest.Mocked<ViaCepService>;

  const mockAddressResponse = {
    cep: '01001-000',
    logradouro: 'Praça da Sé',
    bairro: 'Sé',
    localidade: 'São Paulo',
    uf: 'SP',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAddressUseCase,
        {
          provide: ViaCepService,
          useValue: {
            getAddressByCep: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetAddressUseCase);
    viaCepService = module.get(ViaCepService);
  });

  it('should return address by CEP', async () => {
    viaCepService.getAddressByCep.mockResolvedValue(mockAddressResponse);

    const result = await useCase.execute({ cep: '01001-000' });

    expect(result).toEqual(mockAddressResponse);
    expect(result.cep).toBe('01001-000');
    expect(result.logradouro).toBe('Praça da Sé');
    expect(result.localidade).toBe('São Paulo');
    expect(result.uf).toBe('SP');
  });

  it('should throw error for invalid CEP', async () => {
    viaCepService.getAddressByCep.mockRejectedValue(new Error('CEP inválido'));

    await expect(useCase.execute({ cep: '00000-000' })).rejects.toThrow(
      'CEP inválido',
    );
  });

  it('should throw error when CEP not found', async () => {
    viaCepService.getAddressByCep.mockRejectedValue(
      new Error('CEP não encontrado'),
    );

    await expect(useCase.execute({ cep: '99999-999' })).rejects.toThrow(
      'CEP não encontrado',
    );
  });

  it('should throw error when ViaCEP service is unavailable', async () => {
    viaCepService.getAddressByCep.mockRejectedValue(
      new Error('Serviço ViaCEP indisponível'),
    );

    await expect(useCase.execute({ cep: '01001-000' })).rejects.toThrow(
      'Serviço ViaCEP indisponível',
    );
  });

  it('should return complete address with all fields', async () => {
    const completeAddress = {
      cep: '20040-020',
      logradouro: 'Avenida Rio Branco',
      bairro: 'Centro',
      localidade: 'Rio de Janeiro',
      uf: 'RJ',
    };

    viaCepService.getAddressByCep.mockResolvedValue(completeAddress);

    const result = await useCase.execute({ cep: '20040-020' });

    expect(result.logradouro).toBeTruthy();
    expect(result.bairro).toBeTruthy();
    expect(result.localidade).toBeTruthy();
    expect(result.uf).toHaveLength(2);
  });
});
