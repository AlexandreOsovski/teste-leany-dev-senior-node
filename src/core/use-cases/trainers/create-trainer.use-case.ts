import { Injectable } from '@nestjs/common';
import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerService } from '../../services/trainer.service';

export interface CreateTrainerInput {
  name: string;
  email: string;
  cep?: string;
}

@Injectable()
export class CreateTrainerUseCase {
  constructor(private readonly trainerService: TrainerService) {}

  async execute(input: CreateTrainerInput): Promise<Trainer> {
    return this.trainerService.createTrainer({
      name: input.name,
      email: input.email,
    });
  }
}
