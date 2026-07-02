import { Test, TestingModule } from '@nestjs/testing';
import { ListTrainersUseCase } from '../list-trainers.use-case';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../domain/entities/trainer.entity';

describe('ListTrainersUseCase', () => {
  let useCase: ListTrainersUseCase;
  let trainerService: jest.Mocked<TrainerService>;

  const mockTrainers = [
    new Trainer({ id: '1', name: 'Ash', email: 'ash@pokemon.com' }),
    new Trainer({ id: '2', name: 'Misty', email: 'misty@pokemon.com' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTrainersUseCase,
        {
          provide: TrainerService,
          useValue: {
            getAllTrainers: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(ListTrainersUseCase);
    trainerService = module.get(TrainerService);
  });

  it('should return paginated trainers', async () => {
    trainerService.getAllTrainers.mockResolvedValue({
      trainers: mockTrainers,
      total: 2,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.trainers).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('should return empty list when no trainers', async () => {
    trainerService.getAllTrainers.mockResolvedValue({
      trainers: [],
      total: 0,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.trainers).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
