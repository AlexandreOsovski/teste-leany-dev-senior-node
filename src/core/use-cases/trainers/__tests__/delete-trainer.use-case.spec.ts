import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTrainerUseCase } from '../delete-trainer.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { TrainerNotFoundException } from '../../../domain/exceptions/trainer-not-found.exception';

describe('DeleteTrainerUseCase', () => {
  let useCase: DeleteTrainerUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTrainerUseCase,
        {
          provide: TrainerService,
          useValue: {
            softDeleteTrainer: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(DeleteTrainerUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should soft delete trainer successfully', async () => {
    const spy = jest.spyOn(trainerService, 'softDeleteTrainer');
    spy.mockResolvedValue(undefined);

    await useCase.execute('trainer-id');

    expect(spy).toHaveBeenCalledWith('trainer-id');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should throw error when trainer not found', async () => {
    trainerService.softDeleteTrainer.mockRejectedValue(
      new TrainerNotFoundException('non-existent'),
    );

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      TrainerNotFoundException,
    );
  });

  it('should not return any value on success', async () => {
    trainerService.softDeleteTrainer.mockResolvedValue(undefined);

    const result = await useCase.execute('trainer-id');

    expect(result).toBeUndefined();
  });
});
