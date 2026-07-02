import { Injectable } from '@nestjs/common';
import { TrainerService } from '../../services/trainer.service';

@Injectable()
export class DeleteTrainerUseCase {
  constructor(private readonly trainerService: TrainerService) {}

  async execute(id: string): Promise<void> {
    await this.trainerService.softDeleteTrainer(id);
  }
}
