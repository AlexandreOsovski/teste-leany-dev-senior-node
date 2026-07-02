import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTrainerUseCase } from '../update-trainer.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../domain/entities/trainer.entity';

describe('UpdateTrainerUseCase', () => {
  let useCase: UpdateTrainerUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTrainerUseCase,
        {
          provide: TrainerService,
          useValue: {
            updateTrainer: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateTrainerUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should update trainer name', async () => {
    const updatedTrainer = new Trainer({
      id: 'trainer-id',
      name: 'Ash Ketchum Updated',
      email: 'ash@pokemon.com',
    });
    trainerService.updateTrainer.mockResolvedValue(updatedTrainer);

    const result = await useCase.execute({
      id: 'trainer-id',
      name: 'Ash Ketchum Updated',
    });

    expect(result.getName()).toBe('Ash Ketchum Updated');
  });

  it('should update trainer email', async () => {
    const updatedTrainer = new Trainer({
      id: 'trainer-id',
      name: 'Ash Ketchum',
      email: 'ash.new@pokemon.com',
    });
    trainerService.updateTrainer.mockResolvedValue(updatedTrainer);

    const result = await useCase.execute({
      id: 'trainer-id',
      email: 'ash.new@pokemon.com',
    });

    expect(result.getEmail()).toBe('ash.new@pokemon.com');
  });

  it('should throw error when email already taken', async () => {
    trainerService.updateTrainer.mockRejectedValue(
      new Error('Email já cadastrado no sistema'),
    );

    await expect(
      useCase.execute({ id: 'trainer-id', email: 'taken@pokemon.com' }),
    ).rejects.toThrow('Email já cadastrado no sistema');
  });
});
