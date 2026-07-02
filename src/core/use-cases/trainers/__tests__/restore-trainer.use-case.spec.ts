import { Test, TestingModule } from '@nestjs/testing';
import { RestoreTrainerUseCase } from '../restore-trainer.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../domain/entities/trainer.entity';
import { TrainerNotFoundException } from '../../../domain/exceptions/trainer-not-found.exception';

describe('RestoreTrainerUseCase', () => {
  let useCase: RestoreTrainerUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  const mockTrainer = new Trainer({
    id: 'trainer-id',
    name: 'Ash Ketchum',
    email: 'ash@pokemon.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestoreTrainerUseCase,
        {
          provide: TrainerService,
          useValue: {
            restoreTrainer: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(RestoreTrainerUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should restore a deleted trainer', async () => {
    trainerService.restoreTrainer.mockResolvedValue(mockTrainer);

    const result = await useCase.execute('trainer-id');

    expect(result).toEqual(mockTrainer);
  });

  it('should throw TrainerNotFoundException when trainer not found', async () => {
    trainerService.restoreTrainer.mockRejectedValue(
      new TrainerNotFoundException('non-existent'),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      TrainerNotFoundException,
    );
  });
});
