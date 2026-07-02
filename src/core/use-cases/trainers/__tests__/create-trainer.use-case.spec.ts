import { Test, TestingModule } from '@nestjs/testing';
import { CreateTrainerUseCase } from '../create-trainer.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../domain/entities/trainer.entity';

describe('CreateTrainerUseCase', () => {
  let useCase: CreateTrainerUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  const mockTrainer = new Trainer({
    id: 'trainer-id',
    name: 'Ash Ketchum',
    email: 'ash@pokemon.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTrainerUseCase,
        {
          provide: TrainerService,
          useValue: {
            createTrainer: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateTrainerUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should create a trainer successfully', async () => {
    const spy = jest.spyOn(trainerService, 'createTrainer');
    spy.mockResolvedValue(mockTrainer);

    const input = { name: 'Ash Ketchum', email: 'ash@pokemon.com' };
    const result = await useCase.execute(input);

    expect(result).toEqual(mockTrainer);
    expect(spy).toHaveBeenCalledWith({
      name: 'Ash Ketchum',
      email: 'ash@pokemon.com',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should throw error when email already exists', async () => {
    trainerService.createTrainer.mockRejectedValue(
      new Error('Email já cadastrado no sistema'),
    );

    const input = { name: 'Ash Ketchum', email: 'ash@pokemon.com' };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Email já cadastrado no sistema',
    );
  });

  it('should ignore cep field (not passed to service)', async () => {
    const spy = jest.spyOn(trainerService, 'createTrainer');
    spy.mockResolvedValue(mockTrainer);

    const input = { name: 'Ash', email: 'ash@pokemon.com', cep: '01001-000' };
    await useCase.execute(input);

    expect(spy).toHaveBeenCalledWith({
      name: 'Ash',
      email: 'ash@pokemon.com',
    });
  });
});
