import { Injectable } from '@nestjs/common';
import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerService } from '../../services/trainer.service';

export interface ListTrainersInput {
  page?: number;
  limit?: number;
}

export interface ListTrainersOutput {
  trainers: Trainer[];
  total: number;
}

@Injectable()
export class ListTrainersUseCase {
  constructor(private readonly trainerService: TrainerService) {}

  async execute(input: ListTrainersInput): Promise<ListTrainersOutput> {
    return this.trainerService.getAllTrainers({
      page: input.page,
      limit: input.limit,
    });
  }
}
