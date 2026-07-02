import { Test, TestingModule } from '@nestjs/testing';
import { GetTrainerUseCase } from '../get-trainer.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../domain/entities/trainer.entity';
import { TrainerNotFoundException } from '../../../domain/exceptions/trainer-not-found.exception';

describe('GetTrainerUseCase', () => {
  let useCase: GetTrainerUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  const mockTrainer = new Trainer({
    id: 'trainer-id',
    name: 'Ash Ketchum',
    email: 'ash@pokemon.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTrainerUseCase,
        {
          provide: TrainerService,
          useValue: {
            getTrainerById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetTrainerUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should return a trainer by id', async () => {
    trainerService.getTrainerById.mockResolvedValue(mockTrainer);

    const result = await useCase.execute('trainer-id');

    expect(result).toEqual(mockTrainer);
  });

  it('should throw TrainerNotFoundException when trainer not found', async () => {
    trainerService.getTrainerById.mockRejectedValue(
      new TrainerNotFoundException('non-existent'),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      TrainerNotFoundException,
    );
  });
});
