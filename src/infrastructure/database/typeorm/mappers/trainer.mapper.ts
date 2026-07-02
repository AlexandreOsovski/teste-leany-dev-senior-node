import { Trainer } from '../../../../core/domain/entities/trainer.entity';
import { TrainerTypeOrmEntity } from '../entities/trainer.typeorm-entity';
import { AddressMapper } from './address.mapper';

export class TrainerMapper {
  static toDomain(entity: TrainerTypeOrmEntity): Trainer {
    const trainer = new Trainer({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      address: entity.address
        ? AddressMapper.toDomain(entity.address)
        : undefined,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return trainer;
  }

  static toPersistence(domain: Trainer): TrainerTypeOrmEntity {
    const entity = new TrainerTypeOrmEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.email = domain.getEmail();
    entity.address = domain.getAddress()
      ? AddressMapper.toPersistence(domain.getAddress()!)
      : undefined;
    entity.deletedAt = domain.getDeletedAt();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
