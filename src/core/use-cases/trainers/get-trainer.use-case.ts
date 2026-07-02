import { Injectable } from '@nestjs/common';
import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerService } from '../../services/trainer.service';

@Injectable()
export class GetTrainerUseCase {
  constructor(private readonly trainerService: TrainerService) {}

  async execute(id: string): Promise<Trainer> {
    return this.trainerService.getTrainerById(id);
  }
}
