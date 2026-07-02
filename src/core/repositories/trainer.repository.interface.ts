import { Trainer } from '../domain/entities/trainer.entity';

export interface ITrainerRepository {
  findById(id: string): Promise<Trainer | null>;
  findByEmail(email: string): Promise<Trainer | null>;
  findAll(options?: {
    skip?: number;
    take?: number;
    includeDeleted?: boolean;
  }): Promise<{ trainers: Trainer[]; total: number }>;
  create(trainer: Trainer): Promise<Trainer>;
  update(trainer: Trainer): Promise<Trainer>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<Trainer>;
}
