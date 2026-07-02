import { Injectable } from '@nestjs/common';
import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerService } from '../../services/trainer.service';

export interface UpdateTrainerInput {
  id: string;
  name?: string;
  email?: string;
}

@Injectable()
export class UpdateTrainerUseCase {
  constructor(private readonly trainerService: TrainerService) {}

  async execute(input: UpdateTrainerInput): Promise<Trainer> {
    return this.trainerService.updateTrainer(input.id, {
      name: input.name,
      email: input.email,
    });
  }
}
