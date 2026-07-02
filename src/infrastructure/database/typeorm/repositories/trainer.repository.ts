import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ITrainerRepository } from '../../../../core/repositories/trainer.repository.interface';
import { Trainer } from '../../../../core/domain/entities/trainer.entity';
import { TrainerTypeOrmEntity } from '../entities/trainer.typeorm-entity';
import { TrainerMapper } from '../mappers/trainer.mapper';

@Injectable()
export class TrainerRepository implements ITrainerRepository {
  constructor(
    @InjectRepository(TrainerTypeOrmEntity)
    private readonly repository: Repository<TrainerTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Trainer | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['address'],
      withDeleted: true,
    });

    return entity ? TrainerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() },
      withDeleted: true,
    });

    return entity ? TrainerMapper.toDomain(entity) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    includeDeleted?: boolean;
  }): Promise<{ trainers: Trainer[]; total: number }> {
    const where: any = {};

    if (!options?.includeDeleted) {
      where.deletedAt = IsNull();
    }

    const [entities, total] = await this.repository.findAndCount({
      where,
      relations: ['address'],
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });

    return {
      trainers: entities.map((entity) => TrainerMapper.toDomain(entity)),
      total,
    };
  }

  async create(trainer: Trainer): Promise<Trainer> {
    const entity = TrainerMapper.toPersistence(trainer);
    const savedEntity = await this.repository.save(entity);
    return TrainerMapper.toDomain(savedEntity);
  }

  async update(trainer: Trainer): Promise<Trainer> {
    const entity = TrainerMapper.toPersistence(trainer);
    await this.repository.save(entity);
    return trainer;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<Trainer> {
    await this.repository.restore(id);
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (!entity) {
      throw new Error('Trainer not found');
    }

    return TrainerMapper.toDomain(entity);
  }
}
