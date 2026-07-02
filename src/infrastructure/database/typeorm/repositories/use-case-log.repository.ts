import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseCaseLog } from '../../../../core/domain/entities/use-case-log.entity';
import { UseCaseLogModel } from '../entities/use-case-log-entity';
import { UseCaseLogMapper } from '../mappers/use-case-log.mapper';

@Injectable()
export class UseCaseLogRepository {
  constructor(
    @InjectRepository(UseCaseLogModel)
    private readonly repository: Repository<UseCaseLogModel>,
  ) {}

  async insert(domain: UseCaseLog): Promise<void> {
    const model = UseCaseLogMapper.toModel(domain);
    await this.repository.save(model);
  }
}
