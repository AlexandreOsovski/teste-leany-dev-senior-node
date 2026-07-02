import { Trainer } from '../domain/entities/trainer.entity';
import { ITrainerRepository } from '../repositories/trainer.repository.interface';
import { TrainerNotFoundException } from '../domain/exceptions/trainer-not-found.exception';
import { Inject } from '@nestjs/common';

export class TrainerService {
  constructor(
    @Inject('ITrainerRepository')
    private readonly trainerRepository: ITrainerRepository,
  ) {}

  async createTrainer(data: { name: string; email: string }): Promise<Trainer> {
    const existingTrainer = await this.trainerRepository.findByEmail(
      data.email,
    );
    if (existingTrainer) {
      throw new Error('Email já cadastrado no sistema');
    }

    const trainer = new Trainer({
      name: data.name,
      email: data.email,
    });

    return this.trainerRepository.create(trainer);
  }

  async getTrainerById(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer || trainer.isDeleted()) {
      throw new TrainerNotFoundException(id);
    }
    return trainer;
  }

  async getAllTrainers(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ trainers: Trainer[]; total: number }> {
    const skip =
      options?.page && options?.limit
        ? (options.page - 1) * options.limit
        : undefined;
    const take = options?.limit;

    return this.trainerRepository.findAll({ skip, take });
  }

  async updateTrainer(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<Trainer> {
    const trainer = await this.getTrainerById(id);

    if (data.email && data.email !== trainer.getEmail()) {
      const existingTrainer = await this.trainerRepository.findByEmail(
        data.email,
      );
      if (existingTrainer) {
        throw new Error('Email já cadastrado no sistema');
      }
    }

    trainer.updateProfile(data);
    return this.trainerRepository.update(trainer);
  }

  async softDeleteTrainer(id: string): Promise<void> {
    const trainer = await this.getTrainerById(id);
    if (trainer.getId()) {
      await this.trainerRepository.softDelete(id);
    }
    throw new Error('Treinador não encontrado ou já deletado');
  }

  async restoreTrainer(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new TrainerNotFoundException(id);
    }

    trainer.restore();
    return this.trainerRepository.update(trainer);
  }
}
