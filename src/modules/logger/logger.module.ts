import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UseCaseLogModel } from '../../infrastructure/database/typeorm/entities/use-case-log-entity';
import { UseCaseLogRepository } from '../../infrastructure/database/typeorm/repositories/use-case-log.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UseCaseLogModel])],
  providers: [
    UseCaseLogRepository,
    {
      provide: 'UseCaseLogRepository',
      useExisting: UseCaseLogRepository,
    },
  ],
  exports: [UseCaseLogRepository, 'UseCaseLogRepository'],
})
export class LoggerModule {}
